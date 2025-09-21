const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { authenticate, adminOrInvoicingUser, adminOnly } = require('../middleware/auth');
const { validate, contactCreateSchema, contactUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create contact - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(contactCreateSchema), ContactController.createContact);

// Get all contacts - Admin and Invoicing User
router.get('/', adminOrInvoicingUser, ContactController.getContacts);

// Get vendors - Admin and Invoicing User (must be before /:id route)
router.get('/vendors', adminOrInvoicingUser, ContactController.getVendors);

// Get contact by ID - Admin and Invoicing User
router.get('/:id', adminOrInvoicingUser, ContactController.getContactById);

// Update contact - Admin only
router.put('/:id', adminOnly, validate(contactUpdateSchema), ContactController.updateContact);

// Delete contact - Admin only
router.delete('/:id', adminOnly, ContactController.deleteContact);

module.exports = router;

