const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// POST /api/auth/register - Public endpoint
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login - Public endpoint
router.post('/login', validate(loginSchema), login);

module.exports = router;
