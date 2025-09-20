const pool = require('../config/database');

class Product {
  static async create({ name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id }) {
    const result = await pool.query(
      'INSERT INTO products (name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id]
    );
    
    return result.rows[0];
  }
  
  static async getAll() {
    const result = await pool.query(`
      SELECT 
        p.*,
        pc.name as category_name,
        st.tax_name as sale_tax_name,
        st.rate as sale_tax_rate,
        pt.tax_name as purchase_tax_name,
        pt.rate as purchase_tax_rate
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN taxes st ON p.sale_tax_id = st.id
      LEFT JOIN taxes pt ON p.purchase_tax_id = pt.id
      ORDER BY p.created_at DESC
    `);
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(`
      SELECT 
        p.*,
        pc.name as category_name,
        st.tax_name as sale_tax_name,
        st.rate as sale_tax_rate,
        st.computation_method as sale_tax_method,
        pt.tax_name as purchase_tax_name,
        pt.rate as purchase_tax_rate,
        pt.computation_method as purchase_tax_method
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN taxes st ON p.sale_tax_id = st.id
      LEFT JOIN taxes pt ON p.purchase_tax_id = pt.id
      WHERE p.id = $1
    `, [id]);
    
    return result.rows[0];
  }
  
  static async update(id, { name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id }) {
    const result = await pool.query(
      'UPDATE products SET name = $1, type = $2, sales_price = $3, purchase_price = $4, hsn_code = $5, category_id = $6, sale_tax_id = $7, purchase_tax_id = $8 WHERE id = $9 RETURNING *',
      [name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id, id]
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
  
  static async getByType(type) {
    const result = await pool.query(`
      SELECT 
        p.*,
        pc.name as category_name,
        st.tax_name as sale_tax_name,
        st.rate as sale_tax_rate,
        pt.tax_name as purchase_tax_name,
        pt.rate as purchase_tax_rate
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN taxes st ON p.sale_tax_id = st.id
      LEFT JOIN taxes pt ON p.purchase_tax_id = pt.id
      WHERE p.type = $1
      ORDER BY p.created_at DESC
    `, [type]);
    
    return result.rows;
  }
  
  static async getByCategory(category_id) {
    const result = await pool.query(`
      SELECT 
        p.*,
        pc.name as category_name,
        st.tax_name as sale_tax_name,
        st.rate as sale_tax_rate,
        pt.tax_name as purchase_tax_name,
        pt.rate as purchase_tax_rate
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN taxes st ON p.sale_tax_id = st.id
      LEFT JOIN taxes pt ON p.purchase_tax_id = pt.id
      WHERE p.category_id = $1
      ORDER BY p.created_at DESC
    `, [category_id]);
    
    return result.rows;
  }
  
  static async searchByName(name) {
    const result = await pool.query(`
      SELECT 
        p.*,
        pc.name as category_name,
        st.tax_name as sale_tax_name,
        st.rate as sale_tax_rate,
        pt.tax_name as purchase_tax_name,
        pt.rate as purchase_tax_rate
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      LEFT JOIN taxes st ON p.sale_tax_id = st.id
      LEFT JOIN taxes pt ON p.purchase_tax_id = pt.id
      WHERE p.name ILIKE $1
      ORDER BY p.name
    `, [`%${name}%`]);
    
    return result.rows;
  }
}

module.exports = Product;

