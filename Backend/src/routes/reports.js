const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const ProfitLossController = require('../controllers/profitLossController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get sales summary - Admin and Invoicing User
router.get('/sales-summary', adminOrInvoicingUser, ReportController.getSalesSummary);

// Get invoice status report - Admin and Invoicing User
router.get('/invoice-status', adminOrInvoicingUser, ReportController.getInvoiceStatusReport);

// Get customer report - Admin and Invoicing User
router.get('/customers', adminOrInvoicingUser, ReportController.getCustomerReport);

// Get partner ledger - Admin and Invoicing User
router.get('/partner-ledger', adminOrInvoicingUser, ReportController.getPartnerLedger);

// Get profit & loss report - Admin and Invoicing User
router.get('/profit-loss', adminOrInvoicingUser, ReportController.getProfitLossReport);

// Get balance sheet report - Admin and Invoicing User
router.get('/balance-sheet', adminOrInvoicingUser, ReportController.getBalanceSheetReport);

// Get partner ledger - Admin and Invoicing User
router.get('/partner-ledger', adminOrInvoicingUser, ReportController.getPartnerLedger);

// P&L Transaction routes
router.post('/profit-loss/transaction', adminOrInvoicingUser, ProfitLossController.addTransaction);
router.post('/profit-loss/purchase-order', adminOrInvoicingUser, ProfitLossController.addPurchaseOrderTransaction);
router.get('/profit-loss/transactions', adminOrInvoicingUser, ProfitLossController.getTransactions);
router.get('/profit-loss/summary', adminOrInvoicingUser, ProfitLossController.getSummary);
router.get('/profit-loss/revenue', adminOrInvoicingUser, ProfitLossController.getRevenueTransactions);
router.get('/profit-loss/expenses', adminOrInvoicingUser, ProfitLossController.getExpenseTransactions);
router.delete('/profit-loss/transaction/:transactionId', adminOrInvoicingUser, ProfitLossController.deleteTransaction);

module.exports = router;

