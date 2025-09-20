const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const organizationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  address: {
    type: addressSchema,
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
organizationSchema.index({ name: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
