const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

const createInvoice = async (req, res) => {
  try {
    const { customer_id, issue_date, due_date, status, items } = req.body;
    const created_by = req.user.id;

    // Validate customer exists
    const customerExists = await Customer.exists(customer_id);
    if (!customerExists) {
      return res.status(400).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Validate all products exist
    for (const item of items) {
      const productExists = await Product.exists(item.product_id);
      if (!productExists) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`
        });
      }
    }

    const invoice = await Invoice.create({
      customer_id,
      issue_date,
      due_date,
      status,
      created_by,
      items
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();

    res.json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoices',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdWithItems(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, issue_date, due_date, status } = req.body;

    // Validate customer exists if provided
    if (customer_id) {
      const customerExists = await Customer.exists(customer_id);
      if (!customerExists) {
        return res.status(400).json({
          success: false,
          message: 'Customer not found'
        });
      }
    }

    const invoice = await Invoice.update(id, {
      customer_id,
      issue_date,
      due_date,
      status
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice
};
