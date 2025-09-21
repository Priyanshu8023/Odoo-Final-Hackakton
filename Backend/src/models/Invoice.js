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
  },
  // PDF storage fields
  pdfData: {
    fileId: { 
      type: mongoose.Schema.Types.ObjectId 
    },
    fileName: { 
      type: String, 
      trim: true 
    },
    filePath: { 
      type: String, 
      trim: true 
    },
    fileSize: { 
      type: Number 
    },
    mimeType: { 
      type: String, 
      default: 'application/pdf' 
    },
    generatedAt: { 
      type: Date 
    },
    generatedBy: { 
      type: String, 
      trim: true 
    },
    gridFSFileId: { 
      type: String 
    }
  },
  // Payment details
  paymentDetails: {
    paymentId: { 
      type: String, 
      trim: true 
    },
    paymentMethod: { 
      type: String, 
      trim: true 
    },
    transactionId: { 
      type: String, 
      trim: true 
    },
    paymentDate: { 
      type: Date 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending' 
    }
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

// Static methods
invoiceSchema.statics.create = async function(data) {
  const invoice = new this(data);
  return await invoice.save();
};

invoiceSchema.statics.getAll = async function(organizationId) {
  return await this.find({ organizationId })
    .populate('customerId', 'name email mobile')
    .populate('lineItems.productId', 'name')
    .populate('lineItems.tax.taxId', 'tax_name rate')
    .sort({ createdAt: -1 });
};

invoiceSchema.statics.getById = async function(id, organizationId) {
  return await this.findOne({ _id: id, organizationId })
    .populate('customerId', 'name email mobile')
    .populate('lineItems.productId', 'name')
    .populate('lineItems.tax.taxId', 'tax_name rate');
};

invoiceSchema.statics.getByIdWithItems = async function(id) {
  return await this.findById(id)
    .populate('customerId', 'name email mobile')
    .populate('lineItems.productId', 'name')
    .populate('lineItems.tax.taxId', 'tax_name rate');
};

invoiceSchema.statics.update = async function(id, data, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId },
    data,
    { new: true, runValidators: true }
  ).populate('customerId', 'name email mobile');
};

invoiceSchema.statics.updateStatus = async function(id, status) {
  return await this.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('customerId', 'name email mobile');
};

invoiceSchema.statics.delete = async function(id, organizationId) {
  return await this.findOneAndDelete({ _id: id, organizationId });
};

invoiceSchema.statics.getByCustomerId = async function(customerId, organizationId) {
  return await this.find({ customerId, organizationId })
    .populate('customerId', 'name email mobile')
    .populate('lineItems.productId', 'name')
    .populate('lineItems.tax.taxId', 'tax_name rate')
    .sort({ createdAt: -1 });
};

invoiceSchema.statics.updateWithPDF = async function(invoiceId, pdfData, paymentDetails) {
  return await this.findByIdAndUpdate(
    invoiceId,
    {
      $set: {
        pdfData: {
          fileId: pdfData.fileId,
          fileName: pdfData.fileName,
          filePath: pdfData.filePath,
          fileSize: pdfData.fileSize,
          mimeType: pdfData.mimeType || 'application/pdf',
          generatedAt: new Date(),
          generatedBy: pdfData.generatedBy || 'system',
          gridFSFileId: pdfData.gridFSFileId
        },
        paymentDetails: {
          paymentId: paymentDetails.paymentId,
          paymentMethod: paymentDetails.paymentMethod,
          transactionId: paymentDetails.transactionId,
          paymentDate: new Date(paymentDetails.paymentDate),
          paymentStatus: paymentDetails.paymentStatus || 'paid'
        },
        status: 'paid',
        amountPaid: paymentDetails.amountPaid,
        balanceDue: 0
      }
    },
    { new: true, runValidators: true }
  ).populate('customerId', 'name email mobile');
};

module.exports = mongoose.model('Invoice', invoiceSchema);