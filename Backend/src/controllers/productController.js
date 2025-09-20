const Product = require('../models/Product');

class ProductController {
  static async createProduct(req, res) {
    try {
      const { name, type, salesPrice, purchasePrice, hsnCode, category, saleTaxId, purchaseTaxId } = req.body;
      const organizationId = req.user.organizationId;
      
      const product = await Product.create({
        organizationId,
        name,
        type,
        salesPrice,
        purchasePrice,
        hsnCode,
        category,
        saleTaxId,
        purchaseTaxId
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
      const organizationId = req.user.organizationId;
      const products = await Product.getAll(organizationId);
      
      // Transform products to match frontend expectations
      const transformedProducts = products.map(product => ({
        id: product._id,
        name: product.name,
        type: product.type,
        sales_price: parseFloat(product.salesPrice.toString()),
        purchase_price: parseFloat(product.purchasePrice.toString()),
        hsn_code: product.hsnCode,
        category_name: product.category,
        created_at: product.createdAt
      }));
      
      res.json({
        success: true,
        data: { products: transformedProducts }
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
      const organizationId = req.user.organizationId;
      
      const product = await Product.getById(id, organizationId);
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
      const { name, type, salesPrice, purchasePrice, hsnCode, category, saleTaxId, purchaseTaxId } = req.body;
      const organizationId = req.user.organizationId;
      
      // Check if product exists
      const existingProduct = await Product.getById(id, organizationId);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const product = await Product.update(id, {
        name,
        type,
        salesPrice,
        purchasePrice,
        hsnCode,
        category,
        saleTaxId,
        purchaseTaxId
      }, organizationId);
      
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
      const organizationId = req.user.organizationId;
      
      // Check if product exists
      const existingProduct = await Product.getById(id, organizationId);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const product = await Product.delete(id, organizationId);
      
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

