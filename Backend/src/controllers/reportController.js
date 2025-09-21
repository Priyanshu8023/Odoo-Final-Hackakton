const { mongoose } = require('../config/database');
const Contact = require('../models/Contact');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

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
      const organizationId = req.user.organizationId;
      
      // Build filter for contacts
      const contactFilter = { 
        organizationId,
        isArchived: false,
        type: { $in: ['customer', 'vendor'] }
      };
      
      if (partner_id) {
        contactFilter._id = partner_id;
      }
      
      if (search) {
        contactFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Get partners
      const partners = await Contact.find(contactFilter).select('_id name email type');
      
      // Build date filter
      const dateFilter = {};
      if (start_date && end_date) {
        dateFilter.createdAt = {
          $gte: new Date(start_date),
          $lte: new Date(end_date)
        };
      }
      
      // Get invoices for these partners
      const invoiceFilter = {
        organizationId,
        ...dateFilter
      };
      
      if (partner_id) {
        invoiceFilter.customerId = partner_id;
      } else if (partners.length > 0) {
        invoiceFilter.customerId = { $in: partners.map(p => p._id) };
      }
      
      const invoices = await Invoice.find(invoiceFilter)
        .populate('customerId', 'name email type')
        .sort({ createdAt: 1 });
      
      // Get payments for these partners
      const paymentFilter = {
        organizationId,
        ...dateFilter
      };
      
      if (partner_id) {
        paymentFilter.customerId = partner_id;
      } else if (partners.length > 0) {
        paymentFilter.customerId = { $in: partners.map(p => p._id) };
      }
      
      const payments = await Payment.find(paymentFilter)
        .populate('customerId', 'name email type')
        .sort({ createdAt: 1 });
      
      // Create ledger entries
      const ledgerEntries = [];
      
      // Add invoice entries (debit)
      invoices.forEach(invoice => {
        ledgerEntries.push({
          id: `invoice_${invoice._id}`,
          date: invoice.createdAt,
          description: `Sales Invoice - ${invoice.invoiceNumber || invoice._id}`,
          reference: invoice.invoiceNumber || invoice._id.toString(),
          debit: parseFloat(invoice.totalAmount || 0),
          credit: 0,
          type: 'invoice',
          partner_name: invoice.customerId?.name || 'Unknown'
        });
      });
      
      // Add payment entries (credit)
      payments.forEach(payment => {
        ledgerEntries.push({
          id: `payment_${payment._id}`,
          date: payment.createdAt,
          description: `Payment Received - ${payment.paymentReference || payment._id}`,
          reference: payment.paymentReference || payment._id.toString(),
          debit: 0,
          credit: parseFloat(payment.amount || 0),
          type: 'payment',
          partner_name: payment.customerId?.name || 'Unknown'
        });
      });
      
      // Sort entries by date
      ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Calculate running balance
      let runningBalance = 0;
      ledgerEntries.forEach(entry => {
        runningBalance += entry.debit - entry.credit;
        entry.balance = runningBalance;
      });
      
      // Calculate summary
      const totalDebit = ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0);
      const totalCredit = ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0);
      const currentBalance = totalDebit - totalCredit;
      
      res.json({
        success: true,
        data: {
          entries: ledgerEntries,
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
        message: 'Failed to get partner ledger',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getProfitLossReport(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const organizationId = req.user.organizationId;
      
      // Build date filter
      const dateFilter = {};
      if (start_date && end_date) {
        dateFilter.createdAt = {
          $gte: new Date(start_date),
          $lte: new Date(end_date)
        };
      }
      
      // Get invoices for revenue calculation
      const invoices = await Invoice.find({
        organizationId,
        ...dateFilter
      }).populate('customerId', 'name');
      
      // Calculate revenue
      const totalRevenue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount || 0), 0);
      
      // Mock expense data for now - in a real app, you'd calculate from actual expense records
      const expenses = [
        { name: "Cost of Goods Sold", amount: totalRevenue * 0.4 },
        { name: "Operating Expenses", amount: totalRevenue * 0.2 },
        { name: "Administrative Expenses", amount: totalRevenue * 0.1 }
      ];
      
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const grossProfit = totalRevenue - expenses[0].amount; // COGS
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      
      // Format revenue items
      const revenueItems = [
        { name: "Sales Revenue", amount: totalRevenue, percentage: 100 }
      ];
      
      // Format expense items
      const expenseItems = expenses.map(expense => ({
        name: expense.name,
        amount: expense.amount,
        percentage: totalRevenue > 0 ? (expense.amount / totalRevenue) * 100 : 0
      }));
      
      res.json({
        success: true,
        data: {
          revenue: {
            total: totalRevenue,
            items: revenueItems
          },
          expenses: {
            total: totalExpenses,
            items: expenseItems
          },
          gross_profit: grossProfit,
          net_profit: netProfit,
          profit_margin: profitMargin,
          period: {
            start_date: start_date || new Date().toISOString().split('T')[0],
            end_date: end_date || new Date().toISOString().split('T')[0]
          }
        }
      });
    } catch (error) {
      console.error('Get profit & loss report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profit & loss report',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getBalanceSheetReport(req, res) {
    try {
      const { as_of_date } = req.query;
      const organizationId = req.user.organizationId;
      
      // Mock balance sheet data for now - in a real app, you'd calculate from actual accounting records
      const asOfDate = as_of_date || new Date().toISOString().split('T')[0];
      
      // Mock data
      const assets = {
        current: [
          { name: "Cash and Cash Equivalents", amount: 50000, percentage: 20 },
          { name: "Accounts Receivable", amount: 75000, percentage: 30 },
          { name: "Inventory", amount: 40000, percentage: 16 },
          { name: "Prepaid Expenses", amount: 10000, percentage: 4 }
        ],
        fixed: [
          { name: "Property, Plant & Equipment", amount: 150000, percentage: 60 },
          { name: "Accumulated Depreciation", amount: -30000, percentage: -12 },
          { name: "Intangible Assets", amount: 20000, percentage: 8 }
        ],
        total: 295000
      };
      
      const liabilities = {
        current: [
          { name: "Accounts Payable", amount: 35000, percentage: 11.86 },
          { name: "Short-term Debt", amount: 25000, percentage: 8.47 },
          { name: "Accrued Expenses", amount: 15000, percentage: 5.08 }
        ],
        long_term: [
          { name: "Long-term Debt", amount: 80000, percentage: 27.12 },
          { name: "Deferred Tax Liability", amount: 10000, percentage: 3.39 }
        ],
        total: 165000
      };
      
      const equity = {
        items: [
          { name: "Share Capital", amount: 100000, percentage: 33.90 },
          { name: "Retained Earnings", amount: 30000, percentage: 10.17 }
        ],
        total: 130000
      };
      
      const totalAssets = assets.total;
      const totalLiabilitiesEquity = liabilities.total + equity.total;
      
      res.json({
        success: true,
        data: {
          assets,
          liabilities,
          equity,
          total_assets: totalAssets,
          total_liabilities_equity: totalLiabilitiesEquity,
          as_of_date: asOfDate
        }
      });
    } catch (error) {
      console.error('Get balance sheet report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get balance sheet report',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ReportController;

