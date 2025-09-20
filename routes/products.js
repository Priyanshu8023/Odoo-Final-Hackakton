const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  archiveProduct
} = require('../controllers/productController');
const { invoicingUserOrAdmin, adminOnly } = require('../middleware/authorization');
const { validate, productSchema, productUpdateSchema } = require('../middleware/validation');

// POST /api/products - Admin, Invoicing User
router.post('/', invoicingUserOrAdmin, validate(productSchema), createProduct);

// GET /api/products - Admin, Invoicing User
router.get('/', invoicingUserOrAdmin, getProducts);

// GET /api/products/:id - Admin, Invoicing User
router.get('/:id', invoicingUserOrAdmin, getProductById);

// PUT /api/products/:id - Admin only
router.put('/:id', adminOnly, validate(productUpdateSchema), updateProduct);

// PATCH /api/products/:id/archive - Admin only
router.patch('/:id/archive', adminOnly, archiveProduct);

module.exports = router;
