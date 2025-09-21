const Contact = require('../models/Contact');

// Utility function to generate vendor reference number
const generateVendorRefNo = (vendorName) => {
  const namePrefix = vendorName
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .substring(0, 4) // Take first 4 characters
    .toUpperCase();
  
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zero
  const day = currentDate.getDate().toString().padStart(2, '0'); // Day with leading zero
  
  // Format: VENDOR-YYMMDD-XXXX (where XXXX is a random 4-digit number)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  
  return `${namePrefix}-${year}${month}${day}-${randomSuffix}`;
};

class ContactController {
  static async createContact(req, res) {
    try {
      const { name, type, email, mobile, address, profileImageURL } = req.body;
      
      // Generate vendor reference number if contact is a vendor
      let vendorRefNo = null;
      if (type && type.includes('vendor')) {
        vendorRefNo = generateVendorRefNo(name);
        
        // Ensure uniqueness by checking if reference number already exists
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
          const existingContact = await Contact.findOne({ vendorRefNo });
          if (!existingContact) {
            isUnique = true;
          } else {
            vendorRefNo = generateVendorRefNo(name);
            attempts++;
          }
        }
        
        if (!isUnique) {
          return res.status(400).json({
            success: false,
            message: 'Unable to generate unique vendor reference number. Please try again.'
          });
        }
      }
      
      const contact = new Contact({
        organizationId: req.user.organizationId,
        name,
        type,
        email,
        mobile,
        address: address || {},
        profileImageURL: profileImageURL || '',
        vendorRefNo: vendorRefNo
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
        message: 'Failed to create contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  static async getContacts(req, res) {
    try {
      const { type, page = 1, limit = 100 } = req.query; // Increased default limit to 100
      
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
        message: 'Failed to get contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Failed to get contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Failed to update contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Failed to delete contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getVendors(req, res) {
    try {
      console.log('getVendors called with query:', req.query);
      console.log('User:', req.user);
      
      const { search } = req.query;
      
      const filter = { 
        organizationId: req.user.organizationId,
        isArchived: false,
        type: { $in: ['vendor'] } // Only fetch contacts that are vendors
      };
      
      console.log('Filter:', filter);
      
      // Add search functionality
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ];
      }
      
      const vendors = await Contact.find(filter)
        .select('name email mobile address profileImageURL type vendorRefNo')
        .sort({ name: 1 });
      
      console.log('Found vendors:', vendors.length);
      if (vendors.length > 0) {
        console.log('First vendor full object:', JSON.stringify(vendors[0], null, 2));
      }
      
      res.json({
        success: true,
        data: {
          vendors
        }
      });
    } catch (error) {
      console.error('Get vendors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get vendors',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ContactController;

