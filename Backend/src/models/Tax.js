const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
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
  rate: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  computationMethod: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    required: true 
  },
  applicableOn: [{ 
    type: String, 
    enum: ['sales', 'purchase'],
    required: true 
  }],
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for better performance
taxSchema.index({ organizationId: 1 });
taxSchema.index({ organizationId: 1, name: 1 });
taxSchema.index({ organizationId: 1, applicableOn: 1 });

// Virtual for formatted rate
taxSchema.virtual('formattedRate').get(function() {
  return parseFloat(this.rate.toString());
});

module.exports = mongoose.model('Tax', taxSchema);