const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all user routes with authentication
router.use(authMiddleware);

// Middleware to ensure the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
};

router.use(isAdmin);

const userValidation = [
  body('username').trim().notEmpty().isString().isLength({ min: 3, max: 50 }),
  body('password').optional().isString().isLength({ min: 8, max: 200 }),
  body('role').optional().isIn(['admin', 'author'])
];

router.get('/', userController.getAllUsers);
router.post('/', userValidation, validate, userController.createUser);
router.put('/:id', userValidation, validate, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
