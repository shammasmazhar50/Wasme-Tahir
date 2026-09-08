const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  console.log(`[AUTH DEBUG] Origin: ${req.headers.origin}`);
  console.log(`[AUTH DEBUG] Cookies:`, req.cookies);
  let token = null;

  if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (!JWT_SECRET) {
    console.error('[SECURITY] JWT_SECRET is not set in environment variables!');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
