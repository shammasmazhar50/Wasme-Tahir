const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate MFA secret and QR code for setup
exports.generateMfaSetup = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `WT Admin (${user.username})`
    });

    user.mfaSecret = secret.base32;
    await user.save();

    // Generate QR code URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating MFA setup' });
  }
};

// Verify the code and enable MFA
exports.verifyAndEnableMfa = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const user = await User.findByPk(req.user.id);
    if (!user || !user.mfaSecret) {
      return res.status(400).json({ message: 'MFA setup not initiated' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      user.mfaEnabled = true;
      await user.save();
      res.json({ message: 'MFA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying MFA' });
  }
};

// Verify code during login
exports.verifyMfaLogin = async (req, res) => {
  try {
    const { tempToken, mfaCode } = req.body;
    if (!tempToken || !mfaCode) {
      return res.status(400).json({ message: 'Missing token or code' });
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired login session' });
    }

    if (!decoded.tempMfa) {
      return res.status(401).json({ message: 'Invalid login session' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.mfaEnabled) {
      return res.status(400).json({ message: 'MFA not required for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaCode
    });

    if (verified) {
      // Issue real token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );
      
      // Send token in cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      res.json({ success: true, role: user.role, username: user.username });
    } else {
      res.status(400).json({ message: 'Invalid authentication code' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying MFA login' });
  }
};

exports.disableMfa = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.mfaEnabled = false;
    user.mfaSecret = null;
    await user.save();
    
    res.json({ message: 'MFA disabled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error disabling MFA' });
  }
};
