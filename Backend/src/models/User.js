const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, role = 'invoicing_user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );
    
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }
  
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  static async updateRole(id, role) {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role, created_at',
      [role, id]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    return result.rows;
  }
}

module.exports = User;

