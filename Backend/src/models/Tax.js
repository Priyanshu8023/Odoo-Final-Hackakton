const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  tax_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  rate: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  computation_method: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    required: true 
  },
  applicable_on: { 
    type: String, 
    enum: ['sales', 'purchase', 'both'],
    required: true 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for better performance
taxSchema.index({ organizationId: 1 });
taxSchema.index({ organizationId: 1, tax_name: 1 });
taxSchema.index({ organizationId: 1, applicable_on: 1 });

// Virtual for formatted rate
taxSchema.virtual('formattedRate').get(function() {
  return parseFloat(this.rate.toString());
});

// Static methods for the controller
taxSchema.statics.create = async function(data) {
  const tax = new this(data);
  return await tax.save();
};

taxSchema.statics.getAll = async function(organizationId) {
  return await this.find({ organizationId, isArchived: false });
};

taxSchema.statics.getById = async function(id, organizationId) {
  return await this.findOne({ _id: id, organizationId, isArchived: false });
};

taxSchema.statics.update = async function(id, data, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    data, 
    { new: true }
  );
};

taxSchema.statics.delete = async function(id, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    { isArchived: true }, 
    { new: true }
  );
};

taxSchema.statics.getSalesTaxes = async function(organizationId) {
  return await this.find({ 
    organizationId, 
    applicable_on: { $in: ['sales', 'both'] }, 
    isArchived: false 
  });
};

taxSchema.statics.getPurchaseTaxes = async function(organizationId) {
  return await this.find({ 
    organizationId, 
    applicable_on: { $in: ['purchase', 'both'] }, 
    isArchived: false 
  });
};

module.exports = mongoose.model('Tax', taxSchema);