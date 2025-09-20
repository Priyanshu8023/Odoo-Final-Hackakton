const ProductCategory = require('../models/ProductCategory');

class ProductCategoryController {
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      
      const category = await ProductCategory.create({ name });
      
      res.status(201).json({
        success: true,
        message: 'Product category created successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product category'
      });
    }
  }
  
  static async getAllCategories(req, res) {
    try {
      const categories = await ProductCategory.getAll();
      
      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get product categories'
      });
    }
  }
  
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      
      const category = await ProductCategory.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Product category not found'
        });
      }
      
      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get product category'
      });
    }
  }
  
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      // Check if category exists
      const existingCategory = await ProductCategory.getById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Product category not found'
        });
      }
      
      const category = await ProductCategory.update(id, { name });
      
      res.json({
        success: true,
        message: 'Product category updated successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product category'
      });
    }
  }
  
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      // Check if category exists
      const existingCategory = await ProductCategory.getById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Product category not found'
        });
      }
      
      const category = await ProductCategory.delete(id);
      
      res.json({
        success: true,
        message: 'Product category deleted successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product category'
      });
    }
  }
  
  static async getCategoriesWithProductCount(req, res) {
    try {
      const categories = await ProductCategory.getWithProductCount();
      
      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      console.error('Get categories with product count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get categories with product count'
      });
    }
  }
}

module.exports = ProductCategoryController;

