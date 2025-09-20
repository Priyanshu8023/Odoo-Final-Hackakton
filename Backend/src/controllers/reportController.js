const pool = require('../config/database');

class ReportController {
  static async getSalesSummary(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      let whereClause = '';
      let params = [];
      
      if (start_date && end_date) {
        whereClause = 'WHERE i.issue_date BETWEEN $1 AND $2';
        params = [start_date, end_date];
      }
      
      // Get sales summary
      const summaryQuery = `
        SELECT 
          COUNT(*) as total_invoices,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0) as total_paid,
          COALESCE(SUM(CASE WHEN status = 'sent' THEN total_amount ELSE 0 END), 0) as total_sent,
          COALESCE(SUM(CASE WHEN status = 'draft' THEN total_amount ELSE 0 END), 0) as total_draft,
          COALESCE(SUM(total_amount), 0) as total_amount,
          COALESCE(AVG(total_amount), 0) as average_invoice_amount
        FROM invoices i
        ${whereClause}
      `;
      
      const summaryResult = await pool.query(summaryQuery, params);
      const summary = summaryResult.rows[0];
      
      // Get monthly sales data
      const monthlyQuery = `
        SELECT 
          DATE_TRUNC('month', issue_date) as month,
          COUNT(*) as invoice_count,
          COALESCE(SUM(total_amount), 0) as total_amount,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0) as paid_amount
        FROM invoices i
        ${whereClause}
        GROUP BY DATE_TRUNC('month', issue_date)
        ORDER BY month DESC
        LIMIT 12
      `;
      
      const monthlyResult = await pool.query(monthlyQuery, params);
      
      // Get top customers by sales
      const topCustomersQuery = `
        SELECT 
          c.name as customer_name,
          c.contact_email,
          COUNT(i.id) as invoice_count,
          COALESCE(SUM(i.total_amount), 0) as total_amount
        FROM customers c
        LEFT JOIN invoices i ON c.id = i.customer_id
        ${whereClause.replace('i.issue_date', 'i.issue_date')}
        GROUP BY c.id, c.name, c.contact_email
        HAVING COUNT(i.id) > 0
        ORDER BY total_amount DESC
        LIMIT 10
      `;
      
      const topCustomersResult = await pool.query(topCustomersQuery, params);
      
      // Get top products by sales
      const topProductsQuery = `
        SELECT 
          p.name as product_name,
          p.description,
          SUM(ii.quantity) as total_quantity,
          COALESCE(SUM(ii.total_price), 0) as total_sales
        FROM products p
        LEFT JOIN invoice_items ii ON p.id = ii.product_id
        LEFT JOIN invoices i ON ii.invoice_id = i.id
        ${whereClause.replace('i.issue_date', 'i.issue_date')}
        GROUP BY p.id, p.name, p.description
        HAVING SUM(ii.quantity) > 0
        ORDER BY total_sales DESC
        LIMIT 10
      `;
      
      const topProductsResult = await pool.query(topProductsQuery, params);
      
      res.json({
        success: true,
        data: {
          summary: {
            total_invoices: parseInt(summary.total_invoices),
            total_paid: parseFloat(summary.total_paid),
            total_sent: parseFloat(summary.total_sent),
            total_draft: parseFloat(summary.total_draft),
            total_amount: parseFloat(summary.total_amount),
            average_invoice_amount: parseFloat(summary.average_invoice_amount)
          },
          monthly_data: monthlyResult.rows.map(row => ({
            month: row.month,
            invoice_count: parseInt(row.invoice_count),
            total_amount: parseFloat(row.total_amount),
            paid_amount: parseFloat(row.paid_amount)
          })),
          top_customers: topCustomersResult.rows.map(row => ({
            customer_name: row.customer_name,
            contact_email: row.contact_email,
            invoice_count: parseInt(row.invoice_count),
            total_amount: parseFloat(row.total_amount)
          })),
          top_products: topProductsResult.rows.map(row => ({
            product_name: row.product_name,
            description: row.description,
            total_quantity: parseInt(row.total_quantity),
            total_sales: parseFloat(row.total_sales)
          }))
        }
      });
    } catch (error) {
      console.error('Get sales summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sales summary'
      });
    }
  }
  
  static async getInvoiceStatusReport(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      let whereClause = '';
      let params = [];
      
      if (start_date && end_date) {
        whereClause = 'WHERE i.issue_date BETWEEN $1 AND $2';
        params = [start_date, end_date];
      }
      
      const query = `
        SELECT 
          status,
          COUNT(*) as count,
          COALESCE(SUM(total_amount), 0) as total_amount
        FROM invoices i
        ${whereClause}
        GROUP BY status
        ORDER BY status
      `;
      
      const result = await pool.query(query, params);
      
      res.json({
        success: true,
        data: {
          status_breakdown: result.rows.map(row => ({
            status: row.status,
            count: parseInt(row.count),
            total_amount: parseFloat(row.total_amount)
          }))
        }
      });
    } catch (error) {
      console.error('Get invoice status report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get invoice status report'
      });
    }
  }
  
  static async getCustomerReport(req, res) {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.contact_email,
          c.address,
          COUNT(i.id) as total_invoices,
          COALESCE(SUM(i.total_amount), 0) as total_amount,
          COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as paid_amount,
          COALESCE(SUM(CASE WHEN i.status = 'sent' THEN i.total_amount ELSE 0 END), 0) as pending_amount,
          c.created_at
        FROM customers c
        LEFT JOIN invoices i ON c.id = i.customer_id
        WHERE c.is_archived = FALSE
        GROUP BY c.id, c.name, c.contact_email, c.address, c.created_at
        ORDER BY total_amount DESC
      `;
      
      const result = await pool.query(query);
      
      res.json({
        success: true,
        data: {
          customers: result.rows.map(row => ({
            id: row.id,
            name: row.name,
            contact_email: row.contact_email,
            address: row.address,
            total_invoices: parseInt(row.total_invoices),
            total_amount: parseFloat(row.total_amount),
            paid_amount: parseFloat(row.paid_amount),
            pending_amount: parseFloat(row.pending_amount),
            created_at: row.created_at
          }))
        }
      });
    } catch (error) {
      console.error('Get customer report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customer report'
      });
    }
  }

  static async getPartnerLedger(req, res) {
    try {
      const { partner_id, start_date, end_date, search } = req.query;
      
      let whereClause = '';
      let params = [];
      let paramCount = 0;
      
      const conditions = [];
      
      if (partner_id) {
        paramCount++;
        conditions.push(`c.id = $${paramCount}`);
        params.push(partner_id);
      }
      
      if (start_date && end_date) {
        paramCount++;
        conditions.push(`i.issue_date BETWEEN $${paramCount} AND $${paramCount + 1}`);
        params.push(start_date, end_date);
        paramCount++;
      }
      
      if (search) {
        paramCount++;
        conditions.push(`(i.invoice_number ILIKE $${paramCount} OR c.name ILIKE $${paramCount})`);
        params.push(`%${search}%`);
      }
      
      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }
      
      // Get ledger entries from invoices and payments
      const query = `
        WITH ledger_entries AS (
          -- Invoice entries (debit)
          SELECT 
            'invoice_' || i.id as id,
            i.issue_date as date,
            'Sales Invoice - ' || i.invoice_number as description,
            i.invoice_number as reference,
            i.total_amount as debit,
            0 as credit,
            'invoice' as type,
            c.name as partner_name
          FROM invoices i
          JOIN customers c ON i.customer_id = c.id
          ${whereClause}
          
          UNION ALL
          
          -- Payment entries (credit) - assuming we have a payments table
          SELECT 
            'payment_' || p.id as id,
            p.payment_date as date,
            'Payment Received - ' || p.payment_reference as description,
            p.payment_reference as reference,
            0 as debit,
            p.amount as credit,
            'payment' as type,
            c.name as partner_name
          FROM payments p
          JOIN customers c ON p.customer_id = c.id
          ${whereClause.replace('i.issue_date', 'p.payment_date').replace('i.invoice_number', 'p.payment_reference')}
          
          UNION ALL
          
          -- Credit note entries (credit)
          SELECT 
            'credit_' || cn.id as id,
            cn.issue_date as date,
            'Credit Note - ' || cn.credit_note_number as description,
            cn.credit_note_number as reference,
            0 as debit,
            cn.total_amount as credit,
            'credit_note' as type,
            c.name as partner_name
          FROM credit_notes cn
          JOIN customers c ON cn.customer_id = c.id
          ${whereClause.replace('i.issue_date', 'cn.issue_date').replace('i.invoice_number', 'cn.credit_note_number')}
        )
        SELECT 
          id,
          date,
          description,
          reference,
          debit,
          credit,
          type,
          partner_name,
          SUM(debit - credit) OVER (ORDER BY date, id) as balance
        FROM ledger_entries
        ORDER BY date, id
      `;
      
      const result = await pool.query(query, params);
      
      // Calculate summary
      const totalDebit = result.rows.reduce((sum, row) => sum + parseFloat(row.debit), 0);
      const totalCredit = result.rows.reduce((sum, row) => sum + parseFloat(row.credit), 0);
      const currentBalance = totalDebit - totalCredit;
      
      res.json({
        success: true,
        data: {
          entries: result.rows.map(row => ({
            id: row.id,
            date: row.date,
            description: row.description,
            reference: row.reference,
            debit: parseFloat(row.debit),
            credit: parseFloat(row.credit),
            balance: parseFloat(row.balance),
            type: row.type,
            partner_name: row.partner_name
          })),
          summary: {
            total_debit: totalDebit,
            total_credit: totalCredit,
            current_balance: currentBalance
          }
        }
      });
    } catch (error) {
      console.error('Get partner ledger error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get partner ledger'
      });
    }
  }
}

module.exports = ReportController;

