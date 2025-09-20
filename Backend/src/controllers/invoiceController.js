const Invoice = require('../models/Invoice');

class InvoiceController {
  static async createInvoice(req, res) {
    try {
      const { customer_id, issue_date, due_date, status, items } = req.body;
      const created_by = req.user.id;
      
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
        data: { invoice }
      });
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice'
      });
    }
  }
  
  static async getAllInvoices(req, res) {
    try {
      const invoices = await Invoice.getAll();
      
      res.json({
        success: true,
        data: { invoices }
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get invoices'
      });
    }
  }
  
  static async getInvoiceById(req, res) {
    try {
      const { id } = req.params;
      
      const invoice = await Invoice.getByIdWithItems(id);
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      res.json({
        success: true,
        data: { invoice }
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get invoice'
      });
    }
  }
  
  static async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const { customer_id, issue_date, due_date, status, items } = req.body;
      
      // Check if invoice exists
      const existingInvoice = await Invoice.getById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      const invoice = await Invoice.update(id, {
        customer_id,
        issue_date,
        due_date,
        status,
        items
      });
      
      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice'
      });
    }
  }
  
  static async updateInvoiceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Check if invoice exists
      const existingInvoice = await Invoice.getById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      const invoice = await Invoice.updateStatus(id, status);
      
      res.json({
        success: true,
        message: 'Invoice status updated successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Update invoice status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice status'
      });
    }
  }
  
  static async deleteInvoice(req, res) {
    try {
      const { id } = req.params;
      
      // Check if invoice exists
      const existingInvoice = await Invoice.getById(id);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      const invoice = await Invoice.delete(id);
      
      res.json({
        success: true,
        message: 'Invoice deleted successfully',
        data: { invoice }
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoice'
      });
    }
  }
  
  static async getInvoicesByCustomer(req, res) {
    try {
      const { customer_id } = req.params;
      
      const invoices = await Invoice.getByCustomerId(customer_id);
      
      res.json({
        success: true,
        data: { invoices }
      });
    } catch (error) {
      console.error('Get invoices by customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get invoices by customer'
      });
    }
  }
}

module.exports = InvoiceController;


