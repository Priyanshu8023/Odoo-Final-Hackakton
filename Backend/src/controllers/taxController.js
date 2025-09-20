const Tax = require('../models/Tax');

class TaxController {
  static async createTax(req, res) {
    try {
      const { tax_name, computation_method, rate, applicable_on } = req.body;
      
      const tax = await Tax.create({
        tax_name,
        computation_method,
        rate,
        applicable_on
      });
      
      res.status(201).json({
        success: true,
        message: 'Tax created successfully',
        data: { tax }
      });
    } catch (error) {
      console.error('Create tax error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tax'
      });
    }
  }
  
  static async getAllTaxes(req, res) {
    try {
      const taxes = await Tax.getAll();
      
      res.json({
        success: true,
        data: { taxes }
      });
    } catch (error) {
      console.error('Get taxes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get taxes'
      });
    }
  }
  
  static async getTaxById(req, res) {
    try {
      const { id } = req.params;
      
      const tax = await Tax.getById(id);
      if (!tax) {
        return res.status(404).json({
          success: false,
          message: 'Tax not found'
        });
      }
      
      res.json({
        success: true,
        data: { tax }
      });
    } catch (error) {
      console.error('Get tax error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get tax'
      });
    }
  }
  
  static async updateTax(req, res) {
    try {
      const { id } = req.params;
      const { tax_name, computation_method, rate, applicable_on } = req.body;
      
      // Check if tax exists
      const existingTax = await Tax.getById(id);
      if (!existingTax) {
        return res.status(404).json({
          success: false,
          message: 'Tax not found'
        });
      }
      
      const tax = await Tax.update(id, {
        tax_name,
        computation_method,
        rate,
        applicable_on
      });
      
      res.json({
        success: true,
        message: 'Tax updated successfully',
        data: { tax }
      });
    } catch (error) {
      console.error('Update tax error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update tax'
      });
    }
  }
  
  static async deleteTax(req, res) {
    try {
      const { id } = req.params;
      
      // Check if tax exists
      const existingTax = await Tax.getById(id);
      if (!existingTax) {
        return res.status(404).json({
          success: false,
          message: 'Tax not found'
        });
      }
      
      const tax = await Tax.delete(id);
      
      res.json({
        success: true,
        message: 'Tax deleted successfully',
        data: { tax }
      });
    } catch (error) {
      console.error('Delete tax error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete tax'
      });
    }
  }
  
  static async getSalesTaxes(req, res) {
    try {
      const taxes = await Tax.getSalesTaxes();
      
      res.json({
        success: true,
        data: { taxes }
      });
    } catch (error) {
      console.error('Get sales taxes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sales taxes'
      });
    }
  }
  
  static async getPurchaseTaxes(req, res) {
    try {
      const taxes = await Tax.getPurchaseTaxes();
      
      res.json({
        success: true,
        data: { taxes }
      });
    } catch (error) {
      console.error('Get purchase taxes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get purchase taxes'
      });
    }
  }
}

module.exports = TaxController;

