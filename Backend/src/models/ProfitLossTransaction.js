const mongoose = require('mongoose');

const profitLossTransactionSchema = new mongoose.Schema({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true,
    unique: true 
  },
  transactionType: { 
    type: String, 
    enum: ['revenue', 'expense', 'payment_received', 'payment_made'],
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    trim: true 
  },
  subCategory: { 
    type: String, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  amount: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  invoiceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice' 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact' 
  },
  paymentMethod: { 
    type: String, 
    trim: true 
  },
  transactionDate: { 
    type: Date, 
    required: true 
  },
  reference: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed' 
  },
  metadata: {
    paymentId: String,
    transactionId: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
profitLossTransactionSchema.index({ organizationId: 1, transactionDate: 1 });
profitLossTransactionSchema.index({ organizationId: 1, transactionType: 1 });
profitLossTransactionSchema.index({ organizationId: 1, category: 1 });
profitLossTransactionSchema.index({ transactionId: 1 });

// Virtual for formatted amount
profitLossTransactionSchema.virtual('formattedAmount').get(function() {
  return parseFloat(this.amount.toString());
});

// Static methods
profitLossTransactionSchema.statics.createTransaction = async function(data) {
  const transaction = new this(data);
  return await transaction.save();
};

profitLossTransactionSchema.statics.getTransactionsByDateRange = async function(organizationId, startDate, endDate) {
  return await this.find({
    organizationId,
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('invoiceId', 'invoiceNumber')
    .populate('customerId', 'name')
    .sort({ transactionDate: -1 });
};

profitLossTransactionSchema.statics.getRevenueTransactions = async function(organizationId, startDate, endDate) {
  return await this.find({
    organizationId,
    transactionType: { $in: ['revenue', 'payment_received'] },
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('invoiceId', 'invoiceNumber')
    .populate('customerId', 'name')
    .sort({ transactionDate: -1 });
};

profitLossTransactionSchema.statics.getExpenseTransactions = async function(organizationId, startDate, endDate) {
  return await this.find({
    organizationId,
    transactionType: { $in: ['expense', 'payment_made'] },
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('invoiceId', 'invoiceNumber')
    .populate('customerId', 'name')
    .sort({ transactionDate: -1 });
};

profitLossTransactionSchema.statics.getTotalRevenue = async function(organizationId, startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        transactionType: { $in: ['revenue', 'payment_received'] },
        transactionDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: '$amount' } }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

profitLossTransactionSchema.statics.getTotalExpenses = async function(organizationId, startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        transactionType: { $in: ['expense', 'payment_made'] },
        transactionDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: '$amount' } }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

module.exports = mongoose.model('ProfitLossTransaction', profitLossTransactionSchema);
