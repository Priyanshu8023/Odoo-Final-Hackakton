const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
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
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_email, address } = req.body;

    const customer = await Customer.update(id, {
      name,
      contact_email,
      address
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const archiveCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.archive(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer archived successfully',
      data: customer
    });
  } catch (error) {
    console.error('Archive customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive customer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  archiveCustomer
};
