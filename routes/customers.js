const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  archiveCustomer
} = require('../controllers/customerController');
const { invoicingUserOrAdmin, adminOnly } = require('../middleware/authorization');
const { validate, customerSchema, customerUpdateSchema } = require('../middleware/validation');

// POST /api/customers - Admin, Invoicing User
router.post('/', invoicingUserOrAdmin, validate(customerSchema), createCustomer);

// GET /api/customers - Admin, Invoicing User
router.get('/', invoicingUserOrAdmin, getCustomers);

// GET /api/customers/:id - Admin, Invoicing User
router.get('/:id', invoicingUserOrAdmin, getCustomerById);

// PUT /api/customers/:id - Admin only
router.put('/:id', adminOnly, validate(customerUpdateSchema), updateCustomer);

// PATCH /api/customers/:id/archive - Admin only
router.patch('/:id/archive', adminOnly, archiveCustomer);

module.exports = router;
