const User = require('../models/User');
const Organization = require('../models/Organization');
const { generateToken } = require('../utils/jwt');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, role, name } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Get default organization (for now, we'll use the first one)
      const organization = await Organization.findOne();
      if (!organization) {
        return res.status(500).json({
          success: false,
          message: 'No organization found. Please run migration first.'
        });
      }
      
      // Create new user
      const user = new User({
        organizationId: organization._id,
        name: name || 'New User',
        email,
        passwordHash: password, // Will be hashed by pre-save middleware
        role: role || 'invoicing_user',
        isActive: true
      });
      
      await user.save();
      
      // Generate JWT token
      const token = generateToken(user);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            organizationId: user.organizationId,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }
  
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            organizationId: user.organizationId,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }
  
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  }
}

module.exports = AuthController;

