const pool = require('../config/database');

class Invoice {
  static async create({ customer_id, issue_date, due_date, status, created_by, items }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate total amount
      const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      
      // Create invoice
      const invoiceResult = await client.query(
        'INSERT INTO invoices (customer_id, issue_date, due_date, total_amount, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_id, issue_date, due_date, total_amount, status, created_by]
      );
      
      const invoice = invoiceResult.rows[0];
      
      // Create invoice items
      for (const item of items) {
        const total_price = item.quantity * item.unit_price;
        await client.query(
          'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
          [invoice.id, item.product_id, item.quantity, item.unit_price, total_price]
        );
      }
      
      await client.query('COMMIT');
      
      // Fetch complete invoice with items
      const completeInvoice = await this.getByIdWithItems(invoice.id);
      return completeInvoice;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async getAll() {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name as customer_name,
        c.contact_email as customer_email,
        u.email as created_by_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN users u ON i.created_by = u.id
      ORDER BY i.created_at DESC
    `);
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name as customer_name,
        c.contact_email as customer_email,
        c.address as customer_address,
        u.email as created_by_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN users u ON i.created_by = u.id
      WHERE i.id = $1
    `, [id]);
    
    return result.rows[0];
  }
  
  static async getByIdWithItems(id) {
    const invoice = await this.getById(id);
    if (!invoice) return null;
    
    const itemsResult = await pool.query(`
      SELECT 
        ii.*,
        p.name as product_name,
        p.description as product_description
      FROM invoice_items ii
      LEFT JOIN products p ON ii.product_id = p.id
      WHERE ii.invoice_id = $1
      ORDER BY ii.id
    `, [id]);
    
    invoice.items = itemsResult.rows;
    return invoice;
  }
  
  static async update(id, { customer_id, issue_date, due_date, status, items }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate total amount if items are provided
      let total_amount = null;
      if (items) {
        total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      }
      
      // Update invoice
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;
      
      if (customer_id !== undefined) {
        updateFields.push(`customer_id = $${paramCount}`);
        updateValues.push(customer_id);
        paramCount++;
      }
      
      if (issue_date !== undefined) {
        updateFields.push(`issue_date = $${paramCount}`);
        updateValues.push(issue_date);
        paramCount++;
      }
      
      if (due_date !== undefined) {
        updateFields.push(`due_date = $${paramCount}`);
        updateValues.push(due_date);
        paramCount++;
      }
      
      if (status !== undefined) {
        updateFields.push(`status = $${paramCount}`);
        updateValues.push(status);
        paramCount++;
      }
      
      if (total_amount !== null) {
        updateFields.push(`total_amount = $${paramCount}`);
        updateValues.push(total_amount);
        paramCount++;
      }
      
      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);
      
      const updateQuery = `
        UPDATE invoices 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount} 
        RETURNING *
      `;
      
      const invoiceResult = await client.query(updateQuery, updateValues);
      const invoice = invoiceResult.rows[0];
      
      // Update invoice items if provided
      if (items) {
        // Delete existing items
        await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [id]);
        
        // Insert new items
        for (const item of items) {
          const total_price = item.quantity * item.unit_price;
          await client.query(
            'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
            [id, item.product_id, item.quantity, item.unit_price, total_price]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Fetch complete invoice with items
      const completeInvoice = await this.getByIdWithItems(id);
      return completeInvoice;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByCustomerId(customer_id) {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name as customer_name,
        c.contact_email as customer_email,
        u.email as created_by_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN users u ON i.created_by = u.id
      WHERE i.customer_id = $1
      ORDER BY i.created_at DESC
    `, [customer_id]);
    
    return result.rows;
  }
  
  static async getByCreatedBy(created_by) {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name as customer_name,
        c.contact_email as customer_email,
        u.email as created_by_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN users u ON i.created_by = u.id
      WHERE i.created_by = $1
      ORDER BY i.created_at DESC
    `, [created_by]);
    
    return result.rows;
  }
}

module.exports = Invoice;


