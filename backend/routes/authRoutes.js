const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const authController = require('../controllers/authController');

// Brute-force protection: Max 5 login attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post(
  '/login',
  loginLimiter,
  [
    body('username').trim().notEmpty().isString().isLength({ max: 100 }),
    body('password').notEmpty().isString().isLength({ max: 200 })
  ],
  validate,
  authController.login
);

const authMiddleware = require('../middleware/authMiddleware');
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authController.logout);

module.exports = router;
