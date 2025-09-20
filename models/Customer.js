const pool = require('../config/database');

class Customer {
  static async create({ name, contact_email, address, created_by }) {
    try {
      const result = await pool.query(
        'INSERT INTO customers (name, contact_email, address, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, contact_email, address, created_by]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM customers WHERE is_archived = FALSE ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM customers WHERE id = $1 AND is_archived = FALSE',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { name, contact_email, address }) {
    try {
      const result = await pool.query(
        'UPDATE customers SET name = COALESCE($1, name), contact_email = COALESCE($2, contact_email), address = COALESCE($3, address) WHERE id = $4 AND is_archived = FALSE RETURNING *',
        [name, contact_email, address, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async archive(id) {
    try {
      const result = await pool.query(
        'UPDATE customers SET is_archived = TRUE WHERE id = $1 RETURNING *',
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
        'SELECT id FROM customers WHERE id = $1 AND is_archived = FALSE',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Customer;
