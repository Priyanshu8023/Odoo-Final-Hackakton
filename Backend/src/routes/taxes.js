const express = require('express');
const router = express.Router();
const TaxController = require('../controllers/taxController');
const { authenticate, adminOnly, adminOrInvoicingUser } = require('../middleware/auth');
const { validate, taxCreateSchema, taxUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create tax - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(taxCreateSchema), TaxController.createTax);

// Get all taxes - Admin and Invoicing User
router.get('/', TaxController.getAllTaxes);

// Get tax by ID - Admin and Invoicing User
router.get('/:id', TaxController.getTaxById);

// Update tax - Admin only
router.put('/:id', adminOnly, validate(taxUpdateSchema), TaxController.updateTax);

// Delete tax - Admin only
router.delete('/:id', adminOnly, TaxController.deleteTax);

// Get sales taxes - Admin and Invoicing User
router.get('/sales/list', TaxController.getSalesTaxes);

// Get purchase taxes - Admin and Invoicing User
router.get('/purchase/list', TaxController.getPurchaseTaxes);

module.exports = router;
