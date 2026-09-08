/**
 * server.js — Production-hardened Express backend
 * Security: Helmet, CORS, Rate Limiting, Input Validation, File Filtering
 * Stability: Uncaught exception handlers, graceful shutdown, global error middleware
 */

require('dotenv').config();

/* ── Environment Validation ─────────────── */
const requiredEnvs = ['JWT_SECRET', 'DB_PASS', 'ALLOWED_ORIGINS'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  console.error(`[FATAL ERROR] Missing required environment variables: ${missingEnvs.join(', ')}`);
  console.error('Please check your backend/.env file and restart the server.');
  process.exit(1);
}

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');
const cors     = require('cors');
const helmet   = require('helmet');
const hpp      = require('hpp');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const sequelize   = require('./config/database');

/* ── Routes ─────────────────────────────── */
const statRoutes    = require('./routes/statRoutes');
const authRoutes    = require('./routes/authRoutes');
const postRoutes    = require('./routes/postRoutes');
const collabRoutes  = require('./routes/collabRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes    = require('./routes/userRoutes');
const mfaRoutes     = require('./routes/mfaRoutes');

/* ── Process-level crash guards ─────────── */
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err.message, err.stack);
  // Give the process a chance to flush logs, then exit cleanly
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[CRITICAL] Unhandled Promise Rejection:', reason);
  // Do NOT exit — unhandled rejections in Express routes are non-fatal
});

/* ── Ensure uploads directory exists ────── */
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ── Multer — secure file uploads ───────── */
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const sharp = require('sharp');

// Use memory storage so we can process the image with sharp before saving
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max (will be compressed)
});

/* ── Express App ─────────────────────────── */
const app = express();
app.set('trust proxy', 1); // Trust Cloudflare Tunnel proxy

/* 0. Cookie Parser */
app.use(cookieParser());

/* 1. Security headers (Strict CSP) */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow served images
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: [
        "'self'",
        "http://localhost:3001",
        "http://localhost:6002",
        ...(process.env.API_URL ? [process.env.API_URL] : []),
        ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []),
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

/* 2. CORS — strict in prod, permissive in dev */
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? (process.env.ALLOWED_ORIGINS || 'https://wasmetahir.com').split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server requests (no origin) and whitelisted origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      console.error(`[CORS BLOCKED] Rejected origin: ${origin}`);
      cb(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

/* 3. Compression */
app.use(compression());

/* 4. Body size limits — keep them tight */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

/* 5. HTTP Parameter Pollution prevention */
app.use(hpp());

/* 6. Serve uploaded images */
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '7d',         // cache images for 7 days
  etag: true,
  lastModified: true,
}));

/* 7. Global public-API rate limiter & No-Cache */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' },
});

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}, globalLimiter);

/* ── Upload endpoint ─────────────────────── */
const auth = require('./middleware/authMiddleware');

app.post('/api/upload', auth, upload.single('image'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No file received.' });

  try {
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e9)}.webp`;
    const filepath = path.join(UPLOADS_DIR, filename);

    // Optimize image with sharp
    await sharp(req.file.buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(filepath);

    const BASE_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
    res.json({ url: `${BASE_URL}/uploads/${filename}` });
  } catch (err) {
    console.error('[SHARP ERROR]', err);
    res.status(500).json({ error: 'Error processing image.' });
  }
});

/* ── API Routes ──────────────────────────── */
app.use('/api/auth',    authRoutes);
app.use('/api/mfa',     mfaRoutes);
app.use('/api/stats',   statRoutes);
app.use('/api/posts',   postRoutes);
app.use('/api/collab',  collabRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users',   userRoutes);

const sitemapController = require('./controllers/sitemapController');
app.get('/sitemap.xml', sitemapController.getSitemap);

/* ── 404 catch-all ───────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

/* ── Global error handler ────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred.'
    : err.message;
  console.error('[ERROR]', err.message, err.stack);
  res.status(status).json({ message });
});

/* ── DB Sync + Server Start ──────────────── */
const PORT = process.env.PORT || 3001;
let server;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✓ Database connected and synced');

    server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] Port ${PORT} is already in use.`);
        process.exit(1);
      } else {
        throw err;
      }
    });

  } catch (err) {
    console.error('[FATAL] Could not start server:', err.message);
    process.exit(1);
  }
};

/* ── Graceful Shutdown ───────────────────── */
const shutdown = async (signal) => {
  console.log(`\n[${signal}] Graceful shutdown initiated…`);
  if (server) server.close(() => console.log('✓ HTTP server closed'));
  try {
    await sequelize.close();
    console.log('✓ Database connection closed');
  } catch { /* ignore */ }
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

startServer();
