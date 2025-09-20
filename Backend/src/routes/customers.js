const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const { authenticate, adminOrInvoicingUser, adminOnly } = require('../middleware/auth');
const { validate, customerCreateSchema, customerUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create customer - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(customerCreateSchema), CustomerController.createCustomer);

// Get all customers - Admin and Invoicing User
router.get('/', adminOrInvoicingUser, CustomerController.getAllCustomers);

// Get customer by ID - Admin and Invoicing User
router.get('/:id', adminOrInvoicingUser, CustomerController.getCustomerById);

// Update customer - Admin only
router.put('/:id', adminOnly, validate(customerUpdateSchema), CustomerController.updateCustomer);

// Archive customer - Admin only
router.patch('/:id/archive', adminOnly, CustomerController.archiveCustomer);

// Unarchive customer - Admin only
router.patch('/:id/unarchive', adminOnly, CustomerController.unarchiveCustomer);

module.exports = router;

