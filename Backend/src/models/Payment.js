const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['invoice', 'vendor_bill'],
    required: true 
  },
  documentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }
});

const paymentSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  paymentDate: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['received', 'made'],
    required: true 
  },
  contactId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  amount: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'bank'],
    required: true 
  },
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChartOfAccount', 
    required: true 
  },
  reference: {
    type: referenceSchema,
    required: true
  },
  notes: { 
    type: String, 
    trim: true 
  }
}, {
  timestamps: true
});

// Indexes for better performance
paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ organizationId: 1, contactId: 1 });
paymentSchema.index({ organizationId: 1, paymentDate: 1 });
paymentSchema.index({ organizationId: 1, type: 1 });
paymentSchema.index({ 'reference.documentId': 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return parseFloat(this.amount.toString());
});

module.exports = mongoose.model('Payment', paymentSchema);
