const mongoose = require('mongoose');

const relatedDocumentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['vendor_bill', 'invoice', 'adjustment'],
    required: true 
  },
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }
});

const inventoryMovementSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['purchase_in', 'sale_out', 'adjustment'],
    required: true 
  },
  quantityChange: { 
    type: Number, 
    required: true 
  },
  relatedDocument: {
    type: relatedDocumentSchema,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
inventoryMovementSchema.index({ organizationId: 1 });
inventoryMovementSchema.index({ organizationId: 1, productId: 1 });
inventoryMovementSchema.index({ organizationId: 1, date: 1 });
inventoryMovementSchema.index({ organizationId: 1, type: 1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
