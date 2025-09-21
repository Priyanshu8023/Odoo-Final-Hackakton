const pdfService = require('../services/pdfService');
const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

class PDFController {
  /**
   * Generate and store PDF for an invoice
   */
  static async generateInvoicePDF(req, res) {
    try {
      const { invoiceId } = req.params;
      const organizationId = req.user.organizationId;
      
      // Get invoice details
      const invoice = await Invoice.getById(invoiceId, organizationId);
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      // Prepare invoice data for PDF generation
      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerId?.name || 'N/A',
        customerEmail: invoice.customerId?.email,
        customerMobile: invoice.customerId?.mobile,
        customerAddress: invoice.customerId?.address ? 
          `${invoice.customerId.address.city}, ${invoice.customerId.address.state}` : undefined,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        subTotal: parseFloat(invoice.subTotal.toString()),
        totalTax: parseFloat(invoice.totalTax.toString()),
        grandTotal: parseFloat(invoice.grandTotal.toString()),
        amountPaid: parseFloat(invoice.amountPaid.toString()),
        balanceDue: parseFloat(invoice.balanceDue.toString()),
        lineItems: invoice.lineItems.map(item => ({
          description: item.productName,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          total: parseFloat(item.total.toString()),
          tax: item.tax ? {
            name: item.tax.name,
            rate: parseFloat(item.tax.rate?.toString() || '0')
          } : undefined
        })),
        paymentDetails: invoice.paymentDetails ? {
          paymentMethod: invoice.paymentDetails.paymentMethod,
          transactionId: invoice.paymentDetails.transactionId,
          paymentDate: invoice.paymentDetails.paymentDate
        } : undefined
      };
      
      // Generate and store PDF
      const result = await pdfService.generateAndStoreInvoicePDF(invoiceData, organizationId);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate PDF',
          error: result.error
        });
      }
      
      // Update invoice with PDF data
      const pdfData = {
        fileId: result.storageResult.fileId,
        fileName: result.filename,
        filePath: `/api/pdf/download/${result.storageResult.fileId}`,
        fileSize: result.storageResult.length,
        mimeType: 'application/pdf',
        generatedBy: 'system',
        gridFSFileId: result.storageResult.fileId.toString()
      };
      
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        { $set: { pdfData } },
        { new: true }
      ).populate('customerId', 'name email mobile');
      
      res.json({
        success: true,
        message: 'PDF generated and stored successfully',
        data: {
          invoice: updatedInvoice,
          pdfInfo: {
            fileId: result.storageResult.fileId,
            filename: result.filename,
            size: result.storageResult.length
          }
        }
      });
      
    } catch (error) {
      console.error('Generate PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Download PDF by file ID
   */
  static async downloadPDF(req, res) {
    try {
      const { fileId } = req.params;
      
      let pdfBuffer;
      
      // Try GridFS first
      if (pdfService.ensureGridFS() && mongoose.Types.ObjectId.isValid(fileId)) {
        try {
          pdfBuffer = await pdfService.getPDFFromMongoDB(new mongoose.Types.ObjectId(fileId));
        } catch (gridfsError) {
          console.warn('GridFS download failed, trying filesystem:', gridfsError.message);
          // Try filesystem fallback
          try {
            pdfBuffer = await pdfService.getPDFFromFileSystem(fileId);
          } catch (fsError) {
            throw new Error('PDF not found in both GridFS and filesystem');
          }
        }
      } else {
        // Try filesystem storage
        try {
          pdfBuffer = await pdfService.getPDFFromFileSystem(fileId);
        } catch (fsError) {
          return res.status(404).json({
            success: false,
            message: 'PDF not found'
          });
        }
      }
      
      if (!pdfBuffer) {
        return res.status(404).json({
          success: false,
          message: 'PDF not found'
        });
      }
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice_${fileId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send PDF buffer
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('Download PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download PDF',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get PDF info by file ID
   */
  static async getPDFInfo(req, res) {
    try {
      const { fileId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID'
        });
      }
      
      // Ensure GridFS is initialized
      if (!pdfService.ensureGridFS()) {
        return res.status(500).json({
          success: false,
          message: 'GridFS not available. Database connection required.'
        });
      }

      // Get file info from GridFS
      const files = await pdfService.bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
      
      if (files.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'PDF not found'
        });
      }
      
      const file = files[0];
      
      res.json({
        success: true,
        data: {
          fileId: file._id,
          filename: file.filename,
          uploadDate: file.uploadDate,
          length: file.length,
          contentType: file.metadata?.contentType,
          metadata: file.metadata
        }
      });
      
    } catch (error) {
      console.error('Get PDF info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get PDF info',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Delete PDF by file ID
   */
  static async deletePDF(req, res) {
    try {
      const { fileId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID'
        });
      }
      
      // Delete PDF from GridFS
      await pdfService.deletePDFFromMongoDB(new mongoose.Types.ObjectId(fileId));
      
      // Update invoice to remove PDF reference
      await Invoice.updateMany(
        { 'pdfData.gridFSFileId': fileId },
        { $unset: { pdfData: 1 } }
      );
      
      res.json({
        success: true,
        message: 'PDF deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete PDF error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete PDF',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = PDFController;
