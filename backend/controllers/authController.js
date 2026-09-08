const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic input validation
    if (!username || typeof username !== 'string' || username.length > 100) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    if (!password || typeof password !== 'string' || password.length > 200) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const user = await User.findOne({ where: { username: username.trim() } });

    // Always compare even if user not found (prevents timing attacks)
    const dummyHash = '$2a$12$dummyhashplaceholdertopreventtimingattack123456';
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash).then(() => false);

    if (!user || !isMatch) {
      // Generic message — never reveal whether username or password is wrong
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[SECURITY] JWT_SECRET is not set!');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    if (user.mfaEnabled) {
      // Issue temporary token for MFA verification
      const tempToken = jwt.sign(
        { id: user.id, tempMfa: true },
        secret,
        { expiresIn: '15m' }
      );
      return res.json({ mfaRequired: true, tempToken, methods: ['app'] });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      domain: '.wasmetahir.com',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.json({ success: true, role: user.role, username: user.username });
  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    domain: '.wasmetahir.com'
  });
  res.json({ message: 'Logged out successfully' });
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
};
