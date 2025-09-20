const mongoose = require('mongoose');

const chartOfAccountSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  account_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  account_type: { 
    type: String, 
    enum: ['asset', 'liability', 'income', 'expense', 'equity'],
    required: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  isSystemAccount: { 
    type: Boolean, 
    default: false 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for better performance
chartOfAccountSchema.index({ organizationId: 1 });
chartOfAccountSchema.index({ organizationId: 1, account_type: 1 });
chartOfAccountSchema.index({ organizationId: 1, account_name: 1 });

// Static methods for the controller
chartOfAccountSchema.statics.create = async function(data) {
  const account = new this(data);
  return await account.save();
};

chartOfAccountSchema.statics.getAll = async function(organizationId) {
  return await this.find({ organizationId, isArchived: false });
};

chartOfAccountSchema.statics.getById = async function(id, organizationId) {
  return await this.findOne({ _id: id, organizationId, isArchived: false });
};

chartOfAccountSchema.statics.update = async function(id, data, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    data, 
    { new: true }
  );
};

chartOfAccountSchema.statics.delete = async function(id, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    { isArchived: true }, 
    { new: true }
  );
};

module.exports = mongoose.model('ChartOfAccount', chartOfAccountSchema);