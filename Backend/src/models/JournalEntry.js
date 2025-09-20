const mongoose = require('mongoose');

const sourceDocumentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['invoice', 'vendor_bill', 'payment'],
    required: true 
  },
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }
});

const entrySchema = new mongoose.Schema({
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChartOfAccount', 
    required: true 
  },
  debit: { 
    type: mongoose.Schema.Types.Decimal128, 
    default: 0 
  },
  credit: { 
    type: mongoose.Schema.Types.Decimal128, 
    default: 0 
  }
});

const journalEntrySchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  entryDate: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  sourceDocument: {
    type: sourceDocumentSchema,
    required: true
  },
  entries: [entrySchema]
}, {
  timestamps: true
});

// Indexes for better performance
journalEntrySchema.index({ organizationId: 1 });
journalEntrySchema.index({ organizationId: 1, entryDate: 1 });
journalEntrySchema.index({ 'sourceDocument.id': 1 });
journalEntrySchema.index({ 'entries.accountId': 1 });

// Validation to ensure debits equal credits
journalEntrySchema.pre('save', function(next) {
  let totalDebits = 0;
  let totalCredits = 0;

  this.entries.forEach(entry => {
    totalDebits += parseFloat(entry.debit.toString());
    totalCredits += parseFloat(entry.credit.toString());
  });

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    return next(new Error('Total debits must equal total credits'));
  }

  next();
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
