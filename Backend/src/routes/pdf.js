const express = require('express');
const router = express.Router();
const PDFController = require('../controllers/pdfController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Generate PDF for an invoice - Admin and Invoicing User
router.post('/generate/:invoiceId', adminOrInvoicingUser, PDFController.generateInvoicePDF);

// Download PDF by file ID - Admin and Invoicing User
router.get('/download/:fileId', adminOrInvoicingUser, PDFController.downloadPDF);

// Get PDF info by file ID - Admin and Invoicing User
router.get('/info/:fileId', adminOrInvoicingUser, PDFController.getPDFInfo);

// Delete PDF by file ID - Admin and Invoicing User
router.delete('/delete/:fileId', adminOrInvoicingUser, PDFController.deletePDF);

module.exports = router;
