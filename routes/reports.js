const express = require('express');
const router = express.Router();
const {
  getSalesSummary,
  getCustomerReport,
  getProductReport
} = require('../controllers/reportController');
const { invoicingUserOrAdmin } = require('../middleware/authorization');

// GET /api/reports/sales-summary - Admin, Invoicing User
router.get('/sales-summary', invoicingUserOrAdmin, getSalesSummary);

// GET /api/reports/customers - Admin, Invoicing User
router.get('/customers', invoicingUserOrAdmin, getCustomerReport);

// GET /api/reports/products - Admin, Invoicing User
router.get('/products', invoicingUserOrAdmin, getProductReport);

module.exports = router;
