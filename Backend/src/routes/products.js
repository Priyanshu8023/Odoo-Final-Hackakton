const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticate, adminOrInvoicingUser, adminOnly } = require('../middleware/auth');
const { validate, productCreateSchema, productUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create product - Admin and Invoicing User
router.post('/', adminOrInvoicingUser, validate(productCreateSchema), ProductController.createProduct);

// Get all products - Admin and Invoicing User
router.get('/', adminOrInvoicingUser, ProductController.getAllProducts);

// Get product by ID - Admin and Invoicing User
router.get('/:id', adminOrInvoicingUser, ProductController.getProductById);

// Update product - Admin only
router.put('/:id', adminOnly, validate(productUpdateSchema), ProductController.updateProduct);

// Archive product - Admin only
router.patch('/:id/archive', adminOnly, ProductController.archiveProduct);

// Unarchive product - Admin only
router.patch('/:id/unarchive', adminOnly, ProductController.unarchiveProduct);

module.exports = router;


