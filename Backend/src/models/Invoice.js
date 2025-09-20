const pool = require('../config/database');

class Invoice {
  static async create({ customer_id, sales_order_id, invoice_date, due_date, status, items }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate total amount including taxes
      let total_amount = 0;
      for (const item of items) {
        const subtotal = item.quantity * item.unit_price;
        let tax_amount = 0;
        
        if (item.tax_id) {
          // Get tax rate
          const taxResult = await client.query('SELECT rate, computation_method FROM taxes WHERE id = $1', [item.tax_id]);
          if (taxResult.rows.length > 0) {
            const tax = taxResult.rows[0];
            if (tax.computation_method === 'Percentage') {
              tax_amount = (subtotal * tax.rate) / 100;
            } else {
              tax_amount = tax.rate; // Fixed amount
            }
          }
        }
        
        total_amount += subtotal + tax_amount;
      }
      
      // Create invoice
      const invoiceResult = await client.query(
        'INSERT INTO customer_invoices (customer_id, sales_order_id, invoice_date, due_date, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_id, sales_order_id, invoice_date, due_date, total_amount, status]
      );
      
      const invoice = invoiceResult.rows[0];
      
      // Create invoice items
      for (const item of items) {
        const subtotal = item.quantity * item.unit_price;
        await client.query(
          'INSERT INTO customer_invoice_items (invoice_id, product_id, quantity, unit_price, tax_id, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
          [invoice.id, item.product_id, item.quantity, item.unit_price, item.tax_id, subtotal]
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
        ci.*,
        c.name as customer_name,
        c.email as customer_email,
        c.mobile as customer_mobile,
        c.city as customer_city,
        c.state as customer_state,
        so.id as sales_order_id,
        so.order_date as sales_order_date
      FROM customer_invoices ci
      LEFT JOIN contacts c ON ci.customer_id = c.id
      LEFT JOIN sales_orders so ON ci.sales_order_id = so.id
      ORDER BY ci.created_at DESC
    `);
    
    return result.rows;
  }
  
  static async getById(id) {
    const result = await pool.query(`
      SELECT 
        ci.*,
        c.name as customer_name,
        c.email as customer_email,
        c.mobile as customer_mobile,
        c.city as customer_city,
        c.state as customer_state,
        c.pincode as customer_pincode,
        so.id as sales_order_id,
        so.order_date as sales_order_date
      FROM customer_invoices ci
      LEFT JOIN contacts c ON ci.customer_id = c.id
      LEFT JOIN sales_orders so ON ci.sales_order_id = so.id
      WHERE ci.id = $1
    `, [id]);
    
    return result.rows[0];
  }
  
  static async getByIdWithItems(id) {
    const invoice = await this.getById(id);
    if (!invoice) return null;
    
    const itemsResult = await pool.query(`
      SELECT 
        cii.*,
        p.name as product_name,
        p.type as product_type,
        p.hsn_code,
        t.tax_name,
        t.rate as tax_rate,
        t.computation_method as tax_method
      FROM customer_invoice_items cii
      LEFT JOIN products p ON cii.product_id = p.id
      LEFT JOIN taxes t ON cii.tax_id = t.id
      WHERE cii.invoice_id = $1
      ORDER BY cii.id
    `, [id]);
    
    invoice.items = itemsResult.rows;
    return invoice;
  }
  
  static async update(id, { customer_id, sales_order_id, invoice_date, due_date, status, items }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate total amount if items are provided
      let total_amount = null;
      if (items) {
        total_amount = 0;
        for (const item of items) {
          const subtotal = item.quantity * item.unit_price;
          let tax_amount = 0;
          
          if (item.tax_id) {
            // Get tax rate
            const taxResult = await client.query('SELECT rate, computation_method FROM taxes WHERE id = $1', [item.tax_id]);
            if (taxResult.rows.length > 0) {
              const tax = taxResult.rows[0];
              if (tax.computation_method === 'Percentage') {
                tax_amount = (subtotal * tax.rate) / 100;
              } else {
                tax_amount = tax.rate; // Fixed amount
              }
            }
          }
          
          total_amount += subtotal + tax_amount;
        }
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
      
      if (sales_order_id !== undefined) {
        updateFields.push(`sales_order_id = $${paramCount}`);
        updateValues.push(sales_order_id);
        paramCount++;
      }
      
      if (invoice_date !== undefined) {
        updateFields.push(`invoice_date = $${paramCount}`);
        updateValues.push(invoice_date);
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
      
      updateValues.push(id);
      
      const updateQuery = `
        UPDATE customer_invoices 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount} 
        RETURNING *
      `;
      
      const invoiceResult = await client.query(updateQuery, updateValues);
      const invoice = invoiceResult.rows[0];
      
      // Update invoice items if provided
      if (items) {
        // Delete existing items
        await client.query('DELETE FROM customer_invoice_items WHERE invoice_id = $1', [id]);
        
        // Insert new items
        for (const item of items) {
          const subtotal = item.quantity * item.unit_price;
          await client.query(
            'INSERT INTO customer_invoice_items (invoice_id, product_id, quantity, unit_price, tax_id, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, item.product_id, item.quantity, item.unit_price, item.tax_id, subtotal]
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
      'UPDATE customer_invoices SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return result.rows[0];
  }
  
  static async updateAmountPaid(id, amount_paid) {
    const result = await pool.query(
      'UPDATE customer_invoices SET amount_paid = $1 WHERE id = $2 RETURNING *',
      [amount_paid, id]
    );
    
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM customer_invoices WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
  
  static async getByCustomerId(customer_id) {
    const result = await pool.query(`
      SELECT 
        ci.*,
        c.name as customer_name,
        c.email as customer_email,
        c.mobile as customer_mobile
      FROM customer_invoices ci
      LEFT JOIN contacts c ON ci.customer_id = c.id
      WHERE ci.customer_id = $1
      ORDER BY ci.created_at DESC
    `, [customer_id]);
    
    return result.rows;
  }
  
  static async getByStatus(status) {
    const result = await pool.query(`
      SELECT 
        ci.*,
        c.name as customer_name,
        c.email as customer_email,
        c.mobile as customer_mobile
      FROM customer_invoices ci
      LEFT JOIN contacts c ON ci.customer_id = c.id
      WHERE ci.status = $1
      ORDER BY ci.created_at DESC
    `, [status]);
    
    return result.rows;
  }
  
  static async getOverdue() {
    const result = await pool.query(`
      SELECT 
        ci.*,
        c.name as customer_name,
        c.email as customer_email,
        c.mobile as customer_mobile
      FROM customer_invoices ci
      LEFT JOIN contacts c ON ci.customer_id = c.id
      WHERE ci.due_date < CURRENT_DATE 
        AND ci.status != 'Paid' 
        AND ci.status != 'Cancelled'
      ORDER BY ci.due_date ASC
    `);
    
    return result.rows;
  }
}

module.exports = Invoice;

