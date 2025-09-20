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

const vendorBillSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  billNumber: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  billDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  purchaseOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PurchaseOrder' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'awaiting_payment', 'paid', 'void'],
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

// Indexes for better performance
vendorBillSchema.index({ organizationId: 1 });
vendorBillSchema.index({ organizationId: 1, vendorId: 1 });
vendorBillSchema.index({ organizationId: 1, status: 1 });
vendorBillSchema.index({ organizationId: 1, billDate: 1 });
vendorBillSchema.index({ billNumber: 1 });

// Virtual for formatted amounts
vendorBillSchema.virtual('formattedSubTotal').get(function() {
  return parseFloat(this.subTotal.toString());
});

vendorBillSchema.virtual('formattedTotalTax').get(function() {
  return parseFloat(this.totalTax.toString());
});

vendorBillSchema.virtual('formattedGrandTotal').get(function() {
  return parseFloat(this.grandTotal.toString());
});

vendorBillSchema.virtual('formattedAmountPaid').get(function() {
  return parseFloat(this.amountPaid.toString());
});

vendorBillSchema.virtual('formattedBalanceDue').get(function() {
  return parseFloat(this.balanceDue.toString());
});

// Pre-save middleware to generate bill number
vendorBillSchema.pre('save', async function(next) {
  if (this.isNew && !this.billNumber) {
    const count = await this.constructor.countDocuments({ organizationId: this.organizationId });
    this.billNumber = `BILL-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('VendorBill', vendorBillSchema);

