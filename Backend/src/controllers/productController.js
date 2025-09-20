const Product = require('../models/Product');

class ProductController {
  static async createProduct(req, res) {
    try {
      const { name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id } = req.body;
      
      const product = await Product.create({
        name,
        type,
        sales_price,
        purchase_price,
        hsn_code,
        category_id,
        sale_tax_id,
        purchase_tax_id
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
      const products = await Product.getAll();
      
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
      const { name, type, sales_price, purchase_price, hsn_code, category_id, sale_tax_id, purchase_tax_id } = req.body;
      
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
        type,
        sales_price,
        purchase_price,
        hsn_code,
        category_id,
        sale_tax_id,
        purchase_tax_id
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
  
  static async deleteProduct(req, res) {
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
      
      const product = await Product.delete(id);
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }
  }
}

module.exports = ProductController;

