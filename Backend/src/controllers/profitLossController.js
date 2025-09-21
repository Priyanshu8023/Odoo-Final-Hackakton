const ProfitLossTransaction = require('../models/ProfitLossTransaction');
const mongoose = require('mongoose');

class ProfitLossController {
  /**
   * Add a new P&L transaction
   */
  static async addTransaction(req, res) {
    try {
      const {
        transactionId,
        transactionType,
        category,
        subCategory,
        description,
        amount,
        invoiceId,
        customerId,
        paymentMethod,
        transactionDate,
        reference,
        metadata
      } = req.body;
      
      const organizationId = req.user.organizationId;
      
      // Create transaction
      const transaction = await ProfitLossTransaction.createTransaction({
        organizationId,
        transactionId,
        transactionType,
        category,
        subCategory,
        description,
        amount,
        invoiceId: invoiceId ? new mongoose.Types.ObjectId(invoiceId) : undefined,
        customerId: customerId ? new mongoose.Types.ObjectId(customerId) : undefined,
        paymentMethod,
        transactionDate: new Date(transactionDate),
        reference,
        metadata
      });
      
      res.status(201).json({
        success: true,
        message: 'Transaction added successfully',
        data: { transaction }
      });
      
    } catch (error) {
      console.error('Add transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add transaction',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get P&L transactions by date range
   */
  static async getTransactions(req, res) {
    try {
      const { startDate, endDate, type, category } = req.query;
      const organizationId = req.user.organizationId;
      
      let query = { organizationId };
      
      if (startDate && endDate) {
        query.transactionDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      if (type) {
        query.transactionType = type;
      }
      
      if (category) {
        query.category = category;
      }
      
      const transactions = await ProfitLossTransaction.find(query)
        .populate('invoiceId', 'invoiceNumber')
        .populate('customerId', 'name')
        .sort({ transactionDate: -1 });
      
      res.json({
        success: true,
        data: { transactions }
      });
      
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get transactions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get P&L summary
   */
  static async getSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const organizationId = req.user.organizationId;
      
      const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1);
      const defaultEndDate = endDate || new Date();
      
      const [totalRevenue, totalExpenses] = await Promise.all([
        ProfitLossTransaction.getTotalRevenue(organizationId, defaultStartDate, defaultEndDate),
        ProfitLossTransaction.getTotalExpenses(organizationId, defaultStartDate, defaultEndDate)
      ]);
      
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      
      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin: Math.round(profitMargin * 100) / 100
          },
          period: {
            startDate: defaultStartDate,
            endDate: defaultEndDate
          }
        }
      });
      
    } catch (error) {
      console.error('Get P&L summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get P&L summary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get revenue transactions
   */
  static async getRevenueTransactions(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const organizationId = req.user.organizationId;
      
      const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1);
      const defaultEndDate = endDate || new Date();
      
      const transactions = await ProfitLossTransaction.getRevenueTransactions(
        organizationId, 
        defaultStartDate, 
        defaultEndDate
      );
      
      res.json({
        success: true,
        data: { transactions }
      });
      
    } catch (error) {
      console.error('Get revenue transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get revenue transactions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get expense transactions
   */
  static async getExpenseTransactions(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const organizationId = req.user.organizationId;
      
      const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1);
      const defaultEndDate = endDate || new Date();
      
      const transactions = await ProfitLossTransaction.getExpenseTransactions(
        organizationId, 
        defaultStartDate, 
        defaultEndDate
      );
      
      res.json({
        success: true,
        data: { transactions }
      });
      
    } catch (error) {
      console.error('Get expense transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get expense transactions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Delete a transaction
   */
  static async deleteTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const organizationId = req.user.organizationId;
      
      const transaction = await ProfitLossTransaction.findOneAndDelete({
        transactionId,
        organizationId
      });
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Transaction deleted successfully',
        data: { transaction }
      });
      
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete transaction',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Add purchase order transaction to P&L
   */
  static async addPurchaseOrderTransaction(req, res) {
    try {
      const {
        orderId,
        vendorName,
        amount,
        orderDate,
        paymentMethod = 'cash_on_delivery',
        description,
        metadata = {}
      } = req.body;
      
      const organizationId = req.user.organizationId;
      
      // Find vendor contact by name if vendorId not provided
      let vendorId = metadata?.vendorId;
      if (!vendorId) {
        const vendorContact = await mongoose.model('Contact').findOne({
          organizationId,
          name: vendorName,
          type: 'vendor'
        });
        vendorId = vendorContact?._id;
      }

      // Create purchase order transaction
      const transaction = await ProfitLossTransaction.create({
        organizationId,
        transactionId: orderId,
        transactionType: 'purchase_order',
        category: 'Expenses',
        subCategory: 'Purchase Orders',
        description: description || `Purchase order from ${vendorName}`,
        amount: amount,
        customerId: vendorId ? new mongoose.Types.ObjectId(vendorId) : null,
        paymentMethod: paymentMethod,
        transactionDate: new Date(orderDate),
        reference: orderId,
        metadata: {
          ...metadata,
          vendorName: vendorName,
          vendorId: vendorId,
          orderType: 'purchase',
          status: 'pending_payment'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Purchase order transaction added to P&L successfully',
        data: { transaction }
      });
    } catch (error) {
      console.error('Add purchase order transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add purchase order transaction',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ProfitLossController;
