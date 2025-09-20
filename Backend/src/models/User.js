const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, role = 'Invoicing User', contact_id = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role, contact_id) VALUES ($1, $2, $3, $4) RETURNING id, email, role, contact_id, created_at',
      [email, hashedPassword, role, contact_id]
    );
    
    return result.rows[0];
  }
  
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, email, password_hash, role, contact_id, created_at FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }
  
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, contact_id, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async findByIdWithContact(id) {
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.role, u.contact_id, u.created_at,
        c.name as contact_name, c.type as contact_type, c.email as contact_email,
        c.mobile, c.city, c.state, c.pincode
      FROM users u
      LEFT JOIN contacts c ON u.contact_id = c.id
      WHERE u.id = $1
    `, [id]);
    
    return result.rows[0];
  }
  
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  static async updateRole(id, role) {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role, contact_id, created_at',
      [role, id]
    );
    
    return result.rows[0];
  }
  
  static async updateContactId(id, contact_id) {
    const result = await pool.query(
      'UPDATE users SET contact_id = $1 WHERE id = $2 RETURNING id, email, role, contact_id, created_at',
      [contact_id, id]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.role, u.contact_id, u.created_at,
        c.name as contact_name, c.type as contact_type
      FROM users u
      LEFT JOIN contacts c ON u.contact_id = c.id
      ORDER BY u.created_at DESC
    `);
    
    return result.rows;
  }
  
  static async getByRole(role) {
    const result = await pool.query(
      'SELECT id, email, role, contact_id, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      [role]
    );
    
    return result.rows;
  }
}

module.exports = User;

