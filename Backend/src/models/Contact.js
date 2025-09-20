const pool = require('../config/database');

class Contact {
  static async create({ name, type, email, mobile, city, state, pincode, profile_image_url }) {
    const result = await pool.query(
      'INSERT INTO contacts (name, type, email, mobile, city, state, pincode, profile_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, type, email, mobile, city, state, pincode, profile_image_url]
    );
    
    return result.rows[0];
  }
  
  static async getAll(type = null) {
    let query = 'SELECT * FROM contacts';
    let params = [];
    
    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { name, type, email, mobile, city, state, pincode, profile_image_url }) {
    const result = await pool.query(
      'UPDATE contacts SET name = $1, type = $2, email = $3, mobile = $4, city = $5, state = $6, pincode = $7, profile_image_url = $8 WHERE id = $9 RETURNING *',
      [name, type, email, mobile, city, state, pincode, profile_image_url, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getCustomers() {
    return await this.getAll('Customer');
  }
  
  static async getVendors() {
    return await this.getAll('Vendor');
  }
  
  static async getBoth() {
    return await this.getAll('Both');
  }
  
  static async searchByName(name) {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE name ILIKE $1 ORDER BY name',
      [`%${name}%`]
    );
    
    return result.rows;
  }
  
  static async getByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }
}

module.exports = Contact;
