const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

class AuthService {
  /**
   * Register new user
   */
  async registerUser(name, email, password, role = 'user') {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = new User({
        name,
        email,
        password,
        role,
      });

      await user.save();

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updates) {
    try {
      const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
