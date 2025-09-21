const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

class PDFService {
  constructor() {
    this.bucket = null;
    this.initializeGridFS();
  }

  initializeGridFS() {
    try {
      // Wait for database connection
      if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.db;
        this.bucket = new GridFSBucket(db, {
          bucketName: 'invoices'
        });
        console.log('GridFS initialized successfully');
      } else {
        // Wait for connection if not ready
        mongoose.connection.once('open', () => {
          const db = mongoose.connection.db;
          this.bucket = new GridFSBucket(db, {
            bucketName: 'invoices'
          });
          console.log('GridFS initialized after connection');
        });
      }
    } catch (error) {
      console.error('Error initializing GridFS:', error);
    }
  }

  // Ensure GridFS is initialized before use
  ensureGridFS() {
    if (!this.bucket && mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      this.bucket = new GridFSBucket(db, {
        bucketName: 'invoices'
      });
    }
    return this.bucket !== null;
  }

  // Fallback file storage when GridFS is not available
  async storePDFInFileSystem(pdfBuffer, filename, metadata = {}) {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../../uploads/pdfs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, pdfBuffer);
      
      return {
        fileId: filename,
        filename: filename,
        uploadDate: new Date(),
        length: pdfBuffer.length,
        metadata: {
          ...metadata,
          filePath: filePath,
          storageType: 'filesystem'
        }
      };
    } catch (error) {
      throw new Error(`Failed to store PDF in filesystem: ${error.message}`);
    }
  }

  async getPDFFromFileSystem(filename) {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const filePath = path.join(__dirname, '../../uploads/pdfs', filename);
      if (!fs.existsSync(filePath)) {
        throw new Error('PDF file not found');
      }
      
      return fs.readFileSync(filePath);
    } catch (error) {
      throw new Error(`Failed to read PDF from filesystem: ${error.message}`);
    }
  }

  /**
   * Generate PDF invoice with complete details
   */
  async generateInvoicePDF(invoiceData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Invoice ${invoiceData.invoiceNumber}`,
            Author: 'Shiv Accounts',
            Subject: 'Invoice Document',
            Creator: 'Shiv Accounts System'
          }
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        this.addHeader(doc, invoiceData);
        
        // Company Info
        this.addCompanyInfo(doc);
        
        // Customer Info
        this.addCustomerInfo(doc, invoiceData);
        
        // Invoice Details
        this.addInvoiceDetails(doc, invoiceData);
        
        // Line Items Table
        this.addLineItemsTable(doc, invoiceData);
        
        // Totals
        this.addTotals(doc, invoiceData);
        
        // Payment Info
        this.addPaymentInfo(doc, invoiceData);
        
        // Footer
        this.addFooter(doc);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  addHeader(doc, invoiceData) {
    // Company Logo Area (placeholder)
    doc.rect(50, 50, 100, 50)
       .fill('#f0f0f0');
    
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('SHIV ACCOUNTS', 50, 70);
    
    doc.fontSize(10)
       .fillColor('#666')
       .text('Accounting & Billing System', 50, 95);
    
    // Invoice Title
    doc.fontSize(28)
       .fillColor('#000')
       .text('INVOICE', 400, 70, { align: 'right' });
    
    doc.fontSize(16)
       .fillColor('#666')
       .text(invoiceData.invoiceNumber, 400, 100, { align: 'right' });
  }

  addCompanyInfo(doc) {
    const companyInfo = {
      name: 'Shiv Accounts',
      address: '123 Business Street\nMumbai, Maharashtra 400001\nIndia',
      phone: '+91 98765 43210',
      email: 'info@shivaccounts.com',
      website: 'www.shivaccounts.com'
    };

    doc.fontSize(10)
       .fillColor('#000')
       .text(companyInfo.name, 50, 120)
       .text(companyInfo.address, 50, 140)
       .text(`Phone: ${companyInfo.phone}`, 50, 200)
       .text(`Email: ${companyInfo.email}`, 50, 215)
       .text(`Website: ${companyInfo.website}`, 50, 230);
  }

  addCustomerInfo(doc, invoiceData) {
    doc.fontSize(12)
       .fillColor('#000')
       .text('BILL TO:', 350, 120);
    
    doc.fontSize(10)
       .text(invoiceData.customerName || 'N/A', 350, 140);
    
    if (invoiceData.customerEmail) {
      doc.text(`Email: ${invoiceData.customerEmail}`, 350, 160);
    }
    
    if (invoiceData.customerMobile) {
      doc.text(`Phone: ${invoiceData.customerMobile}`, 350, 175);
    }
    
    if (invoiceData.customerAddress) {
      doc.text(`Address: ${invoiceData.customerAddress}`, 350, 190);
    }
  }

  addInvoiceDetails(doc, invoiceData) {
    const y = 250;
    
    doc.fontSize(10)
       .fillColor('#000')
       .text('Invoice Date:', 50, y)
       .text(new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN'), 150, y)
       .text('Due Date:', 300, y)
       .text(new Date(invoiceData.dueDate).toLocaleDateString('en-IN'), 400, y)
       .text('Status:', 50, y + 20)
       .text(invoiceData.status.toUpperCase(), 150, y + 20)
       .text('Payment Terms:', 300, y + 20)
       .text('Net 30', 400, y + 20);
  }

  addLineItemsTable(doc, invoiceData) {
    const startY = 300;
    const tableTop = startY;
    const itemHeight = 20;
    const leftMargin = 50;
    const rightMargin = 550;
    
    // Table headers
    doc.fontSize(10)
       .fillColor('#fff')
       .rect(leftMargin, tableTop, rightMargin - leftMargin, itemHeight)
       .fill('#2563eb');
    
    doc.text('Description', leftMargin + 10, tableTop + 5)
       .text('Qty', 300, tableTop + 5)
       .text('Rate', 350, tableTop + 5)
       .text('Amount', 450, tableTop + 5);
    
    // Table rows
    let currentY = tableTop + itemHeight;
    
    if (invoiceData.lineItems && invoiceData.lineItems.length > 0) {
      invoiceData.lineItems.forEach((item, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }
        
        doc.fillColor('#000')
           .rect(leftMargin, currentY, rightMargin - leftMargin, itemHeight)
           .stroke();
        
        doc.text(item.description || 'N/A', leftMargin + 10, currentY + 5)
           .text(item.quantity.toString(), 300, currentY + 5)
           .text(`₹${item.unitPrice.toFixed(2)}`, 350, currentY + 5)
           .text(`₹${item.total.toFixed(2)}`, 450, currentY + 5);
        
        currentY += itemHeight;
      });
    } else {
      // Default payment item
      doc.fillColor('#000')
         .rect(leftMargin, currentY, rightMargin - leftMargin, itemHeight)
         .stroke();
      
      doc.text(`Payment for Invoice ${invoiceData.invoiceNumber}`, leftMargin + 10, currentY + 5)
         .text('1', 300, currentY + 5)
         .text(`₹${invoiceData.grandTotal.toFixed(2)}`, 350, currentY + 5)
         .text(`₹${invoiceData.grandTotal.toFixed(2)}`, 450, currentY + 5);
      
      currentY += itemHeight;
    }
    
    // Table bottom border
    doc.rect(leftMargin, currentY, rightMargin - leftMargin, itemHeight)
       .stroke();
  }

  addTotals(doc, invoiceData) {
    const startY = 500;
    const rightMargin = 550;
    const leftMargin = 400;
    
    doc.fontSize(10)
       .fillColor('#000')
       .text('Subtotal:', leftMargin, startY)
       .text(`₹${invoiceData.subTotal.toFixed(2)}`, rightMargin - 100, startY)
       .text('Tax:', leftMargin, startY + 20)
       .text(`₹${invoiceData.totalTax.toFixed(2)}`, rightMargin - 100, startY + 20)
       .text('Total:', leftMargin, startY + 40)
       .text(`₹${invoiceData.grandTotal.toFixed(2)}`, rightMargin - 100, startY + 40)
       .text('Amount Paid:', leftMargin, startY + 60)
       .text(`₹${invoiceData.amountPaid.toFixed(2)}`, rightMargin - 100, startY + 60)
       .text('Balance Due:', leftMargin, startY + 80)
       .text(`₹${invoiceData.balanceDue.toFixed(2)}`, rightMargin - 100, startY + 80);
    
    // Highlight total
    doc.fontSize(12)
       .fillColor('#2563eb')
       .text('GRAND TOTAL:', leftMargin, startY + 100)
       .text(`₹${invoiceData.grandTotal.toFixed(2)}`, rightMargin - 100, startY + 100);
  }

  addPaymentInfo(doc, invoiceData) {
    if (invoiceData.paymentDetails) {
      const startY = 600;
      
      doc.fontSize(10)
         .fillColor('#000')
         .text('PAYMENT INFORMATION:', 50, startY)
         .text(`Payment Method: ${invoiceData.paymentDetails.paymentMethod}`, 50, startY + 20);
      
      if (invoiceData.paymentDetails.transactionId) {
        doc.text(`Transaction ID: ${invoiceData.paymentDetails.transactionId}`, 50, startY + 40);
      }
      
      if (invoiceData.paymentDetails.paymentDate) {
        doc.text(`Payment Date: ${new Date(invoiceData.paymentDetails.paymentDate).toLocaleDateString('en-IN')}`, 50, startY + 60);
      }
    }
  }

  addFooter(doc) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 100;
    
    doc.fontSize(8)
       .fillColor('#666')
       .text('Thank you for your business!', 50, footerY)
       .text('For any queries, contact us at info@shivaccounts.com', 50, footerY + 15)
       .text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 50, footerY + 30);
  }

  /**
   * Store PDF in MongoDB GridFS
   */
  async storePDFInMongoDB(pdfBuffer, filename, metadata = {}) {
    return new Promise((resolve, reject) => {
      if (!this.ensureGridFS()) {
        reject(new Error('GridFS not initialized. Database connection required.'));
        return;
      }

      const uploadStream = this.bucket.openUploadStream(filename, {
        metadata: {
          ...metadata,
          contentType: 'application/pdf',
          uploadedAt: new Date()
        }
      });

      uploadStream.on('error', (error) => {
        reject(error);
      });

      uploadStream.on('finish', (file) => {
        resolve({
          fileId: file._id,
          filename: file.filename,
          uploadDate: file.uploadDate,
          length: file.length,
          metadata: file.metadata
        });
      });

      uploadStream.end(pdfBuffer);
    });
  }

  /**
   * Retrieve PDF from MongoDB GridFS
   */
  async getPDFFromMongoDB(fileId) {
    return new Promise((resolve, reject) => {
      if (!this.ensureGridFS()) {
        reject(new Error('GridFS not initialized. Database connection required.'));
        return;
      }

      const downloadStream = this.bucket.openDownloadStream(fileId);
      const chunks = [];

      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('error', (error) => {
        reject(error);
      });

      downloadStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  /**
   * Delete PDF from MongoDB GridFS
   */
  async deletePDFFromMongoDB(fileId) {
    return new Promise((resolve, reject) => {
      if (!this.ensureGridFS()) {
        reject(new Error('GridFS not initialized. Database connection required.'));
        return;
      }

      this.bucket.delete(fileId, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Generate and store complete invoice PDF
   */
  async generateAndStoreInvoicePDF(invoiceData, organizationId) {
    try {
      // Generate PDF
      const pdfBuffer = await this.generateInvoicePDF(invoiceData);
      
      // Create filename
      const filename = `invoice_${invoiceData.invoiceNumber}_${Date.now()}.pdf`;
      
      // Prepare metadata
      const metadata = {
        organizationId: organizationId,
        invoiceNumber: invoiceData.invoiceNumber,
        customerId: invoiceData.customerId,
        invoiceDate: invoiceData.invoiceDate,
        generatedBy: 'system',
        type: 'invoice'
      };
      
      let storageResult;
      
      // Try GridFS first, fallback to filesystem
      if (this.ensureGridFS()) {
        try {
          storageResult = await this.storePDFInMongoDB(pdfBuffer, filename, metadata);
          console.log('PDF stored in GridFS successfully');
        } catch (gridfsError) {
          console.warn('GridFS storage failed, using filesystem fallback:', gridfsError.message);
          storageResult = await this.storePDFInFileSystem(pdfBuffer, filename, metadata);
        }
      } else {
        console.log('GridFS not available, using filesystem storage');
        storageResult = await this.storePDFInFileSystem(pdfBuffer, filename, metadata);
      }
      
      return {
        success: true,
        pdfBuffer,
        storageResult,
        filename
      };
    } catch (error) {
      console.error('Error generating and storing PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PDFService();
