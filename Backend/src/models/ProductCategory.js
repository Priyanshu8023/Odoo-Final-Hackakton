const pool = require('../config/database');

class ProductCategory {
  static async create({ name }) {
    const result = await pool.query(
      'INSERT INTO product_categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM product_categories ORDER BY name'
    );
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM product_categories WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { name }) {
    const result = await pool.query(
      'UPDATE product_categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM product_categories WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getWithProductCount() {
    const result = await pool.query(`
      SELECT 
        pc.*,
        COUNT(p.id) as product_count
      FROM product_categories pc
      LEFT JOIN products p ON pc.id = p.category_id
      GROUP BY pc.id, pc.name, pc.created_at
      ORDER BY pc.name
    `);
    
    return result.rows;
  }
}

module.exports = ProductCategory;

