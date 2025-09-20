const pool = require('../config/database');

class Product {
  static async create({ name, description, price, created_by }) {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, created_by]
    );
    
    return result.rows[0];
  }
  
  static async getAll(includeArchived = false) {
    let query = 'SELECT * FROM products';
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
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { name, description, price }) {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    
    return result.rows[0];
  }
  
  static async archive(id) {
    const result = await pool.query(
      'UPDATE products SET is_archived = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async unarchive(id) {
    const result = await pool.query(
      'UPDATE products SET is_archived = FALSE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByCreatedBy(created_by) {
    const result = await pool.query(
      'SELECT * FROM products WHERE created_by = $1 AND is_archived = FALSE ORDER BY created_at DESC',
      [created_by]
    );
    
    return result.rows;
  }
}

module.exports = Product;

