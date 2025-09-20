const pool = require('../config/database');

class Product {
  static async create({ name, description, price, created_by }) {
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, created_by]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE is_archived = FALSE ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND is_archived = FALSE',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { name, description, price }) {
    try {
      const result = await pool.query(
        'UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price) WHERE id = $4 AND is_archived = FALSE RETURNING *',
        [name, description, price, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async archive(id) {
    try {
      const result = await pool.query(
        'UPDATE products SET is_archived = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async exists(id) {
    try {
      const result = await pool.query(
        'SELECT id FROM products WHERE id = $1 AND is_archived = FALSE',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
