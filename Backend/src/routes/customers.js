const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const { authenticate, adminOrInvoicingUser, adminOnly } = require('../middleware/auth');
const { validate, contactCreateSchema, contactUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create customer - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(contactCreateSchema), CustomerController.createCustomer);

// Get all customers - Admin and Invoicing User
router.get('/', adminOrInvoicingUser, CustomerController.getAllCustomers);

// Get customer by ID - Admin and Invoicing User
router.get('/:id', adminOrInvoicingUser, CustomerController.getCustomerById);

// Update customer - Admin only
router.put('/:id', adminOnly, validate(contactUpdateSchema), CustomerController.updateCustomer);

// Delete customer - Admin only
router.delete('/:id', adminOnly, CustomerController.deleteCustomer);

module.exports = router;

