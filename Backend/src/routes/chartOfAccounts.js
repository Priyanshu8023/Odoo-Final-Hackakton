const express = require('express');
const router = express.Router();
const ChartOfAccountController = require('../controllers/chartOfAccountController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');
const { validate, chartOfAccountCreateSchema, chartOfAccountUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create account - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(chartOfAccountCreateSchema), ChartOfAccountController.createAccount);

// Get all accounts - Admin and Invoicing User
router.get('/', ChartOfAccountController.getAllAccounts);

// Get account by ID - Admin and Invoicing User
router.get('/:id', ChartOfAccountController.getAccountById);

// Update account - Admin and Invoicing User
router.put('/:id', adminOrInvoicingUser, validate(chartOfAccountUpdateSchema), ChartOfAccountController.updateAccount);

// Delete account - Admin and Invoicing User
router.delete('/:id', adminOrInvoicingUser, ChartOfAccountController.deleteAccount);

// Update account status - Admin and Invoicing User
router.patch('/:id/status', adminOrInvoicingUser, ChartOfAccountController.updateAccountStatus);

module.exports = router;
