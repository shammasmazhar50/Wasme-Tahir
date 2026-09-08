const express = require('express');
const router = express.Router();
const mfaController = require('../controllers/mfaController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const mfaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { message: 'Too many attempts, please try again later' }
});

const mfaValidation = [
  body('mfaCode').notEmpty().isString().isLength({ min: 6, max: 6 })
];

// Verify MFA during login (public but uses temporary token)
router.post(
  '/verify-login', 
  mfaLimiter, 
  [
    body('tempToken').notEmpty().isString(),
    ...mfaValidation
  ], 
  validate, 
  mfaController.verifyMfaLogin
);

// Protected routes for managing MFA
router.use(authMiddleware);

router.get('/setup', mfaController.generateMfaSetup);
router.post(
  '/enable', 
  [body('token').notEmpty().isString().isLength({ min: 6, max: 6 })], 
  validate, 
  mfaController.verifyAndEnableMfa
);
router.post('/disable', mfaController.disableMfa);

module.exports = router;
