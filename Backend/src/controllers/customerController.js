const Contact = require('../models/Contact');

class CustomerController {
  static async createCustomer(req, res) {
    try {
      const { name, type, email, mobile, city, state, pincode, profile_image_url } = req.body;
      
      const contact = await Contact.create({
        name,
        type: type || 'Customer',
        email,
        mobile,
        city,
        state,
        pincode,
        profile_image_url
      });
      
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { customer: contact }
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
      const customers = await Contact.getCustomers();
      
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
      
      const customer = await Contact.getById(id);
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
      const { name, type, email, mobile, city, state, pincode, profile_image_url } = req.body;
      
      // Check if customer exists
      const existingCustomer = await Contact.getById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      const customer = await Contact.update(id, {
        name,
        type,
        email,
        mobile,
        city,
        state,
        pincode,
        profile_image_url
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
  
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      
      // Check if customer exists
      const existingCustomer = await Contact.getById(id);
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      
      const customer = await Contact.delete(id);
      
      res.json({
        success: true,
        message: 'Customer deleted successfully',
        data: { customer }
      });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer'
      });
    }
  }
}

module.exports = CustomerController;

