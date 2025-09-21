const Invoice = require('../models/Invoice');

class InvoiceController {
  static async createInvoice(req, res) {
    try {
      const { customer_id, sales_order_id, invoice_date, due_date, status, items } = req.body;
      const organizationId = req.user.organizationId;
      
      const invoice = await Invoice.create({
        organizationId,
        customerId: customer_id,
        salesOrderId: sales_order_id,
        invoiceDate: invoice_date,
        dueDate: due_date,
        status: status || 'draft',
        lineItems: items || [],
        subTotal: 0, // Will be calculated
        totalTax: 0, // Will be calculated
        grandTotal: 0, // Will be calculated
        amountPaid: 0,
        balanceDue: 0 // Will be calculated
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
      const organizationId = req.user.organizationId;
      const invoices = await Invoice.getAll(organizationId);
      
      // Transform invoices to match frontend expectations
      const transformedInvoices = invoices.map(invoice => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        customer_id: invoice.customerId?._id,
        customer_name: invoice.customerId?.name,
        customer_email: invoice.customerId?.email,
        customer_mobile: invoice.customerId?.mobile,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        status: invoice.status,
        sub_total: parseFloat(invoice.subTotal.toString()),
        total_tax: parseFloat(invoice.totalTax.toString()),
        grand_total: parseFloat(invoice.grandTotal.toString()),
        amount_paid: parseFloat(invoice.amountPaid.toString()),
        balance_due: parseFloat(invoice.balanceDue.toString()),
        line_items: invoice.lineItems.map(item => ({
          productId: item.productId?._id || item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          tax: {
            taxId: item.tax?.taxId?._id || item.tax?.taxId,
            name: item.tax?.name,
            rate: item.tax?.rate ? parseFloat(item.tax.rate.toString()) : 0
          },
          total: parseFloat(item.total.toString())
        })),
        created_at: invoice.createdAt,
        updated_at: invoice.updatedAt
      }));
      
      res.json({
        success: true,
        data: { invoices: transformedInvoices }
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
      const { customer_id, sales_order_id, invoice_date, due_date, status, items } = req.body;
      
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
        sales_order_id,
        invoice_date,
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

