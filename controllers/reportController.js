const Invoice = require('../models/Invoice');
const pool = require('../config/database');

const getSalesSummary = async (req, res) => {
  try {
    const summary = await Invoice.getSalesSummary();

    // Convert string numbers to actual numbers
    const formattedSummary = {
      total_invoices: parseInt(summary.total_invoices) || 0,
      total_amount: parseFloat(summary.total_amount) || 0,
      paid_amount: parseFloat(summary.paid_amount) || 0,
      pending_amount: parseFloat(summary.pending_amount) || 0,
      draft_amount: parseFloat(summary.draft_amount) || 0
    };

    // Calculate additional metrics
    const paidPercentage = formattedSummary.total_amount > 0 
      ? ((formattedSummary.paid_amount / formattedSummary.total_amount) * 100).toFixed(2)
      : 0;

    const response = {
      ...formattedSummary,
      paid_percentage: parseFloat(paidPercentage),
      outstanding_amount: formattedSummary.pending_amount + formattedSummary.draft_amount
    };

    res.json({
      success: true,
      message: 'Sales summary retrieved successfully',
      data: response
    });
  } catch (error) {
    console.error('Get sales summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sales summary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCustomerReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.contact_email,
        COUNT(i.id) as total_invoices,
        COALESCE(SUM(i.total_amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN i.status = 'sent' THEN i.total_amount ELSE 0 END), 0) as pending_amount
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
      WHERE c.is_archived = FALSE
      GROUP BY c.id, c.name, c.contact_email
      ORDER BY total_amount DESC
    `);

    const customers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      contact_email: row.contact_email,
      total_invoices: parseInt(row.total_invoices),
      total_amount: parseFloat(row.total_amount),
      paid_amount: parseFloat(row.paid_amount),
      pending_amount: parseFloat(row.pending_amount),
      outstanding_amount: parseFloat(row.pending_amount)
    }));

    res.json({
      success: true,
      message: 'Customer report retrieved successfully',
      data: customers
    });
  } catch (error) {
    console.error('Get customer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getProductReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        COUNT(ii.id) as times_sold,
        COALESCE(SUM(ii.quantity), 0) as total_quantity_sold,
        COALESCE(SUM(ii.total_price), 0) as total_revenue
      FROM products p
      LEFT JOIN invoice_items ii ON p.id = ii.product_id
      LEFT JOIN invoices i ON ii.invoice_id = i.id
      WHERE p.is_archived = FALSE
      GROUP BY p.id, p.name, p.description, p.price
      ORDER BY total_revenue DESC
    `);

    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      times_sold: parseInt(row.times_sold),
      total_quantity_sold: parseInt(row.total_quantity_sold),
      total_revenue: parseFloat(row.total_revenue)
    }));

    res.json({
      success: true,
      message: 'Product report retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get product report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getSalesSummary,
  getCustomerReport,
  getProductReport
};
