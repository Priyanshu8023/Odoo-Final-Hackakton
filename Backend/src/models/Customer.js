const pool = require('../config/database');

class Customer {
  static async create({ name, contact_email, address, created_by }) {
    const result = await pool.query(
      'INSERT INTO customers (name, contact_email, address, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, contact_email, address, created_by]
    );
    
    return result.rows[0];
  }
  
  static async getAll(includeArchived = false) {
    let query = 'SELECT * FROM customers';
    let params = [];
    
    if (!includeArchived) {
      query += ' WHERE is_archived = FALSE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { name, contact_email, address }) {
    const result = await pool.query(
      'UPDATE customers SET name = $1, contact_email = $2, address = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, contact_email, address, id]
    );
    
    return result.rows[0];
  }
  
  static async archive(id) {
    const result = await pool.query(
      'UPDATE customers SET is_archived = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async unarchive(id) {
    const result = await pool.query(
      'UPDATE customers SET is_archived = FALSE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByCreatedBy(created_by) {
    const result = await pool.query(
      'SELECT * FROM customers WHERE created_by = $1 AND is_archived = FALSE ORDER BY created_at DESC',
      [created_by]
    );
    
    return result.rows;
  }
}

module.exports = Customer;


