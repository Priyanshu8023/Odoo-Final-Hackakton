const pool = require('../config/database');

class Invoice {
  static async create({ customer_id, issue_date, due_date, status = 'draft', created_by, items }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create invoice
      const invoiceResult = await client.query(
        'INSERT INTO invoices (customer_id, issue_date, due_date, total_amount, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_id, issue_date, due_date, 0, status, created_by]
      );
      
      const invoice = invoiceResult.rows[0];
      let totalAmount = 0;

      // Create invoice items and calculate total
      for (const item of items) {
        const itemTotal = item.quantity * item.unit_price;
        totalAmount += itemTotal;

        await client.query(
          'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
          [invoice.id, item.product_id, item.quantity, item.unit_price, itemTotal]
        );
      }

      // Update invoice total
      await client.query(
        'UPDATE invoices SET total_amount = $1 WHERE id = $2',
        [totalAmount, invoice.id]
      );

      await client.query('COMMIT');

      // Return invoice with items
      const invoiceWithItems = await this.findByIdWithItems(invoice.id);
      return invoiceWithItems;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT 
          i.*,
          c.name as customer_name,
          c.contact_email as customer_email
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        ORDER BY i.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT 
          i.*,
          c.name as customer_name,
          c.contact_email as customer_email,
          c.address as customer_address
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        WHERE i.id = $1
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdWithItems(id) {
    try {
      const invoice = await this.findById(id);
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
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { customer_id, issue_date, due_date, status }) {
    try {
      const result = await pool.query(
        'UPDATE invoices SET customer_id = COALESCE($1, customer_id), issue_date = COALESCE($2, issue_date), due_date = COALESCE($3, due_date), status = COALESCE($4, status) WHERE id = $5 RETURNING *',
        [customer_id, issue_date, due_date, status, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async exists(id) {
    try {
      const result = await pool.query(
        'SELECT id FROM invoices WHERE id = $1',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getSalesSummary() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_invoices,
          SUM(total_amount) as total_amount,
          SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
          SUM(CASE WHEN status = 'sent' THEN total_amount ELSE 0 END) as pending_amount,
          SUM(CASE WHEN status = 'draft' THEN total_amount ELSE 0 END) as draft_amount
        FROM invoices
      `);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Invoice;
