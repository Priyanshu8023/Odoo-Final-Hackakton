const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  static async create({ email, password, role = 'invoicing_user' }) {
    try {
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert user
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
        [email, passwordHash, role]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  static generateToken(userId) {
    try {
      return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await this.validatePassword(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
