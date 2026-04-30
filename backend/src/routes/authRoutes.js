const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { body, validationResult } = require('express-validator');

const authService = new AuthService();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const user = await authService.registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: error.message || 'Registration failed',
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: error.message || 'Login failed',
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify token
 */
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token is required',
      });
    }

    const decoded = await authService.verifyToken(token);

    res.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: error.message || 'Token verification failed',
    });
  }
});

/**
 * GET /api/auth/user/:userId
 * Get user details
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await authService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('User retrieval error:', error);
    res.status(500).json({
      error: error.message || 'Error retrieving user',
    });
  }
});

module.exports = router;
