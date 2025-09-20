const mongoose = require('mongoose');

const chartOfAccountSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  accountName: { 
    type: String, 
    required: true,
    trim: true 
  },
  accountType: { 
    type: String, 
    enum: ['asset', 'liability', 'income', 'expense', 'equity'],
    required: true 
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
chartOfAccountSchema.index({ organizationId: 1, accountType: 1 });
chartOfAccountSchema.index({ organizationId: 1, accountName: 1 });

module.exports = mongoose.model('ChartOfAccount', chartOfAccountSchema);