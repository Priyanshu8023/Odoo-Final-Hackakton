const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoiceController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');
const { validate, invoiceCreateSchema, invoiceUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create invoice - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(invoiceCreateSchema), InvoiceController.createInvoice);

// Get all invoices - Admin and Invoicing User
router.get('/', adminOrInvoicingUser, InvoiceController.getAllInvoices);

// Get invoice by ID - Admin and Invoicing User
router.get('/:id', adminOrInvoicingUser, InvoiceController.getInvoiceById);

// Update invoice - Admin and Invoicing User
router.put('/:id', adminOrInvoicingUser, validate(invoiceUpdateSchema), InvoiceController.updateInvoice);

// Update invoice status - Admin and Invoicing User
router.patch('/:id/status', adminOrInvoicingUser, InvoiceController.updateInvoiceStatus);

// Delete invoice - Admin and Invoicing User
router.delete('/:id', adminOrInvoicingUser, InvoiceController.deleteInvoice);

// Get invoices by customer - Admin and Invoicing User
router.get('/customer/:customer_id', adminOrInvoicingUser, InvoiceController.getInvoicesByCustomer);

// Update invoice with PDF data - Admin and Invoicing User
router.patch('/:id/pdf', adminOrInvoicingUser, InvoiceController.updateInvoiceWithPDF);

// Create invoice from payment data - Admin and Invoicing User
router.post('/from-payment', adminOrInvoicingUser, InvoiceController.createInvoiceFromPayment);

module.exports = router;

