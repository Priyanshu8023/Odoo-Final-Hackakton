const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  type: { 
    type: String, 
    enum: ['goods', 'service'],
    required: true 
  },
  salesPrice: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  purchasePrice: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  saleTaxId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tax' 
  },
  purchaseTaxId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tax' 
  },
  hsnCode: { 
    type: String, 
    trim: true 
  },
  category: { 
    type: String, 
    trim: true 
  },
  quantityOnHand: { 
    type: Number, 
    default: 0 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ organizationId: 1 });
productSchema.index({ organizationId: 1, type: 1 });
productSchema.index({ organizationId: 1, name: 1 });
productSchema.index({ organizationId: 1, category: 1 });

// Virtual for formatted sales price
productSchema.virtual('formattedSalesPrice').get(function() {
  return parseFloat(this.salesPrice.toString());
});

// Virtual for formatted purchase price
productSchema.virtual('formattedPurchasePrice').get(function() {
  return parseFloat(this.purchasePrice.toString());
});

// Static methods for the controller
productSchema.statics.create = async function(data) {
  const product = new this(data);
  return await product.save();
};

productSchema.statics.getAll = async function(organizationId) {
  return await this.find({ organizationId, isArchived: false });
};

productSchema.statics.getById = async function(id, organizationId) {
  return await this.findOne({ _id: id, organizationId, isArchived: false });
};

productSchema.statics.update = async function(id, data, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    data, 
    { new: true }
  );
};

productSchema.statics.delete = async function(id, organizationId) {
  return await this.findOneAndUpdate(
    { _id: id, organizationId, isArchived: false }, 
    { isArchived: true }, 
    { new: true }
  );
};

module.exports = mongoose.model('Product', productSchema);