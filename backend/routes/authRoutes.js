const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], register);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;