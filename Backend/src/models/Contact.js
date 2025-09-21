const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true }
});

const contactSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  type: [{ 
    type: String, 
    enum: ['customer', 'vendor'],
    required: true 
  }],
  email: { 
    type: String, 
    trim: true,
    lowercase: true 
  },
  mobile: { 
    type: String, 
    trim: true 
  },
  address: {
    type: addressSchema,
    default: {}
  },
  profileImageURL: { 
    type: String, 
    trim: true 
  },
  vendorRefNo: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allows multiple null values but ensures uniqueness for non-null values
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for better performance
contactSchema.index({ organizationId: 1 });
contactSchema.index({ organizationId: 1, type: 1 });
contactSchema.index({ organizationId: 1, name: 1 });
contactSchema.index({ organizationId: 1, email: 1 });
contactSchema.index({ vendorRefNo: 1 });

// Virtual for checking if contact is a customer
contactSchema.virtual('isCustomer').get(function() {
  return this.type.includes('customer');
});

// Virtual for checking if contact is a vendor
contactSchema.virtual('isVendor').get(function() {
  return this.type.includes('vendor');
});

module.exports = mongoose.model('Contact', contactSchema);