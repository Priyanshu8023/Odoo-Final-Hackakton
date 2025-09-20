const Customer = require('../models/Customer');

class CustomerController {
  static async createCustomer(req, res) {
    try {
      const { name, contact_email, address } = req.body;
      const created_by = req.user.id;
      
      const customer = await Customer.create({
        name,
        contact_email,
        address,
        created_by
      });
      
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { customer }
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer'
      });
    }
  }
  
  static async getAllCustomers(req, res) {
    try {
      const { include_archived } = req.query;
      const includeArchived = include_archived === 'true';
      
      const customers = await Customer.getAll(includeArchived);
      
      res.json({
        success: true,
        data: { customers }
      });
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customers'
      });
    }
  }
  
  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      
      const customer = await Customer.getById(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      res.json({
        success: true,
        data: { customer }
      });
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customer'
      });
    }
  }
  
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { name, contact_email, address } = req.body;
      
      // Check if customer exists
      const existingCustomer = await Customer.getById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      const customer = await Customer.update(id, {
        name,
        contact_email,
        address
      });
      
      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: { customer }
      });
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update customer'
      });
    }
  }
  
  static async archiveCustomer(req, res) {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await Customer.getById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      const customer = await Customer.archive(id);
      
      res.json({
        success: true,
        message: 'Customer archived successfully',
        data: { customer }
      });
    } catch (error) {
      console.error('Archive customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to archive customer'
      });
    }
  }
  
  static async unarchiveCustomer(req, res) {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await Customer.getById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      const customer = await Customer.unarchive(id);
      
      res.json({
        success: true,
        message: 'Customer unarchived successfully',
        data: { customer }
      });
    } catch (error) {
      console.error('Unarchive customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unarchive customer'
      });
    }
  }
}

module.exports = CustomerController;


