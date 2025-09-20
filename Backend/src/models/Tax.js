const pool = require('../config/database');

class Tax {
  static async create({ tax_name, computation_method, rate, applicable_on }) {
    const result = await pool.query(
      'INSERT INTO taxes (tax_name, computation_method, rate, applicable_on) VALUES ($1, $2, $3, $4) RETURNING *',
      [tax_name, computation_method, rate, applicable_on]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM taxes ORDER BY tax_name'
    );
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM taxes WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async update(id, { tax_name, computation_method, rate, applicable_on }) {
    const result = await pool.query(
      'UPDATE taxes SET tax_name = $1, computation_method = $2, rate = $3, applicable_on = $4 WHERE id = $5 RETURNING *',
      [tax_name, computation_method, rate, applicable_on, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM taxes WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByApplicability(applicable_on) {
    const result = await pool.query(
      'SELECT * FROM taxes WHERE applicable_on = $1 OR applicable_on = $2 ORDER BY tax_name',
      [applicable_on, 'Both']
    );
    
    return result.rows;
  }
  
  static async getSalesTaxes() {
    return await this.getByApplicability('Sales');
  }
  
  static async getPurchaseTaxes() {
    return await this.getByApplicability('Purchase');
  }
}

module.exports = Tax;

