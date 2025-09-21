const Invoice = require('../models/Invoice');
const pdfService = require('../services/pdfService');
const mongoose = require('mongoose');

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
  
  static async updateInvoiceWithPDF(req, res) {
    try {
      const { id } = req.params;
      const { pdfData, paymentDetails } = req.body;
      const organizationId = req.user.organizationId;
      
      // Check if invoice exists
      const existingInvoice = await Invoice.getById(id, organizationId);
      if (!existingInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      // Update invoice with PDF data and payment details
      const updatedInvoice = await Invoice.updateWithPDF(id, pdfData, paymentDetails);
      
      res.json({
        success: true,
        message: 'Invoice updated with PDF data successfully',
        data: { invoice: updatedInvoice }
      });
    } catch (error) {
      console.error('Update invoice with PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice with PDF data'
      });
    }
  }

  /**
   * Create invoice from payment data and generate PDF
   */
  static async createInvoiceFromPayment(req, res) {
    try {
      const {
        invoiceNumber,
        partnerId,
        partnerName,
        partnerEmail,
        partnerAddress,
        amountPaid,
        paymentDate,
        paymentMethod,
        transactionId
      } = req.body;
      
      const organizationId = req.user.organizationId;
      
      // Create invoice data
      const invoiceData = {
        invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
        partnerName: partnerName,
        partnerEmail: partnerEmail,
        partnerAddress: partnerAddress,
        invoiceDate: paymentDate,
        dueDate: paymentDate,
        items: [{
          description: `Payment for Invoice ${invoiceNumber}`,
          quantity: 1,
          rate: amountPaid,
          amount: amountPaid
        }],
        subtotal: amountPaid,
        totalTax: 0,
        grandTotal: amountPaid,
        amountPaid: amountPaid,
        balanceDue: 0,
        paymentMethod: paymentMethod,
        transactionId: transactionId
      };

      // Generate and store PDF
      const pdfResult = await pdfService.generateAndStoreInvoicePDF(invoiceData, organizationId);
      
      if (!pdfResult.success) {
        throw new Error(pdfResult.error || 'Failed to generate PDF');
      }

      // Find or create vendor contact
      let vendorContact = null;
      if (partnerId && mongoose.Types.ObjectId.isValid(partnerId)) {
        vendorContact = await mongoose.model('Contact').findById(partnerId);
      }
      
      if (!vendorContact) {
        // Create new vendor contact
        vendorContact = await mongoose.model('Contact').create({
          organizationId,
          name: partnerName,
          email: partnerEmail || '',
          mobile: '',
          type: 'vendor',
          address: {
            street: partnerAddress || '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
          },
          vendorRefNo: `VENDOR-${Date.now()}`,
          isActive: true
        });
      }

      // Create invoice record
      const invoice = await Invoice.create({
        organizationId,
        invoiceNumber: invoiceData.invoiceNumber,
        customerId: vendorContact._id,
        invoiceDate: new Date(invoiceData.invoiceDate),
        dueDate: new Date(invoiceData.dueDate),
        status: 'paid',
        lineItems: [{
          productId: null,
          productName: invoiceData.items[0].description,
          quantity: invoiceData.items[0].quantity,
          unitPrice: invoiceData.items[0].rate,
          tax: {
            taxId: null,
            name: 'No Tax',
            rate: 0
          },
          total: invoiceData.items[0].amount
        }],
        subTotal: invoiceData.subtotal,
        totalTax: invoiceData.totalTax,
        grandTotal: invoiceData.grandTotal,
        amountPaid: invoiceData.amountPaid,
        balanceDue: invoiceData.balanceDue,
        pdfData: {
          fileId: pdfResult.storageResult.fileId,
          fileName: pdfResult.filename,
          filePath: pdfResult.storageResult.metadata?.filePath,
          fileSize: pdfResult.storageResult.length,
          mimeType: 'application/pdf',
          generatedAt: new Date(),
          generatedBy: req.user.username || 'system',
          gridFSFileId: pdfResult.storageResult.metadata?.storageType === 'filesystem' ? undefined : pdfResult.storageResult.fileId.toString()
        },
        paymentDetails: {
          paymentId: `PAY-${Date.now()}`,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          paymentDate: new Date(paymentDate),
          paymentStatus: 'paid'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Invoice created from payment successfully',
        data: {
          invoice: invoice,
          pdfInfo: {
            fileId: pdfResult.storageResult.fileId,
            filename: pdfResult.filename,
            size: pdfResult.storageResult.length,
            storageType: pdfResult.storageResult.metadata?.storageType || 'gridfs'
          }
        }
      });
    } catch (error) {
      console.error('Create invoice from payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice from payment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = InvoiceController;

