const Product = require('../models/Product');

class ProductController {
  static async createProduct(req, res) {
    try {
      const { name, description, price } = req.body;
      const created_by = req.user.id;
      
      const product = await Product.create({
        name,
        description,
        price,
        created_by
      });
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product'
      });
    }
  }
  
  static async getAllProducts(req, res) {
    try {
      const { include_archived } = req.query;
      const includeArchived = include_archived === 'true';
      
      const products = await Product.getAll(includeArchived);
      
      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get products'
      });
    }
  }
  
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get product'
      });
    }
  }
  
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      
      // Check if product exists
      const existingProduct = await Product.getById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const product = await Product.update(id, {
        name,
        description,
        price
      });
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }
  }
  
  static async archiveProduct(req, res) {
    try {
      const { id } = req.params;
      
      // Check if product exists
      const existingProduct = await Product.getById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const product = await Product.archive(id);
      
      res.json({
        success: true,
        message: 'Product archived successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Archive product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to archive product'
      });
    }
  }
  
  static async unarchiveProduct(req, res) {
    try {
      const { id } = req.params;
      
      // Check if product exists
      const existingProduct = await Product.getById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const product = await Product.unarchive(id);
      
      res.json({
        success: true,
        message: 'Product unarchived successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Unarchive product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unarchive product'
      });
    }
  }
}

module.exports = ProductController;


