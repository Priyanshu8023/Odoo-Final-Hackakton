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
}

module.exports = ReportController;


