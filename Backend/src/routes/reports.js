const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get sales summary - Admin and Invoicing User
router.get('/sales-summary', adminOrInvoicingUser, ReportController.getSalesSummary);

// Get invoice status report - Admin and Invoicing User
router.get('/invoice-status', adminOrInvoicingUser, ReportController.getInvoiceStatusReport);

// Get customer report - Admin and Invoicing User
router.get('/customers', adminOrInvoicingUser, ReportController.getCustomerReport);

module.exports = router;

