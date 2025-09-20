const Contact = require('../models/Contact');

class ContactController {
  static async createContact(req, res) {
    try {
      const { name, type, email, mobile, address } = req.body;
      
      const contact = new Contact({
        organizationId: req.user.organizationId,
        name,
        type,
        email,
        mobile,
        address: address || {}
      });
      
      await contact.save();
      
      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create contact'
      });
    }
  }
  
  static async getContacts(req, res) {
    try {
      const { type, page = 1, limit = 10 } = req.query;
      
      const filter = { 
        organizationId: req.user.organizationId,
        isArchived: false 
      };
      
      if (type) {
        filter.type = { $in: [type] };
      }
      
      const contacts = await Contact.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
      
      const total = await Contact.countDocuments(filter);
      
      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contacts'
      });
    }
  }
  
  static async getContactById(req, res) {
    try {
      const { id } = req.params;
      
      const contact = await Contact.findOne({
        _id: id,
        organizationId: req.user.organizationId
      });
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }
      
      res.json({
        success: true,
        data: { contact }
      });
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contact'
      });
    }
  }
  
  static async updateContact(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const contact = await Contact.findOneAndUpdate(
        { _id: id, organizationId: req.user.organizationId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact'
      });
    }
  }
  
  static async deleteContact(req, res) {
    try {
      const { id } = req.params;
      
      const contact = await Contact.findOneAndUpdate(
        { _id: id, organizationId: req.user.organizationId },
        { isArchived: true },
        { new: true }
      );
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Contact archived successfully'
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact'
      });
    }
  }
}

module.exports = ContactController;

