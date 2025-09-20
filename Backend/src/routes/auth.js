const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, userRegistrationSchema, userLoginSchema } = require('../utils/validation');

// Public routes
router.post('/register', validate(userRegistrationSchema), AuthController.register);
router.post('/login', validate(userLoginSchema), AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);

module.exports = router;


