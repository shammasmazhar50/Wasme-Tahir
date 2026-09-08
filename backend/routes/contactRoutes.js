const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

const contactValidation = [
  body('name').trim().notEmpty().isString().isLength({ max: 100 }),
  body('email').trim().notEmpty().isEmail().isLength({ max: 100 }),
  body('message').trim().notEmpty().isString().isLength({ max: 5000 }),
  body('inquiry').optional().isString().isLength({ max: 50 }),
  body('company').optional().isString().isLength({ max: 100 })
];

// Public route to submit
router.post('/', contactValidation, validate, contactController.submitContact);

// Protected routes for Admin
router.get('/', auth, contactController.getSubmissions);
router.put('/:id/read', auth, contactController.markAsRead);
router.delete('/:id', auth, contactController.deleteSubmission);

module.exports = router;
