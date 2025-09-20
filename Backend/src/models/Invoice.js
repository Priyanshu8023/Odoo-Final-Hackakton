const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true,
    trim: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0 
  },
  unitPrice: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  tax: {
    taxId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tax' 
    },
    name: { 
      type: String, 
      trim: true 
    },
    rate: { 
      type: mongoose.Schema.Types.Decimal128 
    }
  },
  total: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  }
});

const invoiceSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  invoiceNumber: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  invoiceDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  salesOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SalesOrder' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'partially_paid', 'void'],
    default: 'draft',
    required: true 
  },
  lineItems: [lineItemSchema],
  subTotal: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  totalTax: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  grandTotal: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  amountPaid: { 
    type: mongoose.Schema.Types.Decimal128, 
    default: 0 
  },
  balanceDue: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  }
}, {
  timestamps: true
});

 
invoiceSchema.index({ organizationId: 1 });
invoiceSchema.index({ organizationId: 1, customerId: 1 });
invoiceSchema.index({ organizationId: 1, status: 1 });
invoiceSchema.index({ organizationId: 1, invoiceDate: 1 });
invoiceSchema.index({ invoiceNumber: 1 });

 
invoiceSchema.virtual('formattedSubTotal').get(function() {
  return parseFloat(this.subTotal.toString());
});

invoiceSchema.virtual('formattedTotalTax').get(function() {
  return parseFloat(this.totalTax.toString());
});

invoiceSchema.virtual('formattedGrandTotal').get(function() {
  return parseFloat(this.grandTotal.toString());
});

invoiceSchema.virtual('formattedAmountPaid').get(function() {
  return parseFloat(this.amountPaid.toString());
});

invoiceSchema.virtual('formattedBalanceDue').get(function() {
  return parseFloat(this.balanceDue.toString());
});

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments({ organizationId: this.organizationId });
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);