const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice
} = require('../controllers/invoiceController');
const { invoicingUserOrAdmin } = require('../middleware/authorization');
const { validate, invoiceSchema, invoiceUpdateSchema } = require('../middleware/validation');

// POST /api/invoices - Admin, Invoicing User
router.post('/', invoicingUserOrAdmin, validate(invoiceSchema), createInvoice);

// GET /api/invoices - Admin, Invoicing User
router.get('/', invoicingUserOrAdmin, getInvoices);

// GET /api/invoices/:id - Admin, Invoicing User
router.get('/:id', invoicingUserOrAdmin, getInvoiceById);

// PUT /api/invoices/:id - Admin, Invoicing User (for updating status)
router.put('/:id', invoicingUserOrAdmin, validate(invoiceUpdateSchema), updateInvoice);

module.exports = router;
