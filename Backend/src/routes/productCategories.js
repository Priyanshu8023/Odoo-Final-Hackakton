const express = require('express');
const router = express.Router();
const ProductCategoryController = require('../controllers/productCategoryController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { validate, productCategoryCreateSchema, productCategoryUpdateSchema } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create product category - Admin only
router.post('/', adminOnly, validate(productCategoryCreateSchema), ProductCategoryController.createCategory);

// Get all categories - Admin and Invoicing User
router.get('/', ProductCategoryController.getAllCategories);

// Get categories with product count - Admin and Invoicing User
router.get('/with-count', ProductCategoryController.getCategoriesWithProductCount);

// Get category by ID - Admin and Invoicing User
router.get('/:id', ProductCategoryController.getCategoryById);

// Update category - Admin only
router.put('/:id', adminOnly, validate(productCategoryUpdateSchema), ProductCategoryController.updateCategory);

// Delete category - Admin only
router.delete('/:id', adminOnly, ProductCategoryController.deleteCategory);

module.exports = router;
