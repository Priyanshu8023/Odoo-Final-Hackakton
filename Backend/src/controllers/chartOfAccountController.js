const ChartOfAccount = require('../models/ChartOfAccount');

class ChartOfAccountController {
  static async createAccount(req, res) {
    try {
      const { account_name, account_type, description } = req.body;
      const organizationId = req.user.organizationId;
      
      const account = await ChartOfAccount.create({
        organizationId,
        account_name,
        account_type,
        description
      });
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { account }
      });
    } catch (error) {
      console.error('Create account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create account'
      });
    }
  }
  
  static async getAllAccounts(req, res) {
    try {
      const organizationId = req.user.organizationId;
      const accounts = await ChartOfAccount.getAll(organizationId);
      
      // Transform accounts to match frontend expectations
      const transformedAccounts = accounts.map(account => ({
        id: account._id,
        account_name: account.account_name,
        account_type: account.account_type,
        description: account.description,
        created_at: account.createdAt
      }));
      
      res.json({
        success: true,
        data: { accounts: transformedAccounts }
      });
    } catch (error) {
      console.error('Get accounts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get accounts'
      });
    }
  }
  
  static async getAccountById(req, res) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;
      
      const account = await ChartOfAccount.getById(id, organizationId);
      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Account not found'
        });
      }
      
      res.json({
        success: true,
        data: { account }
      });
    } catch (error) {
      console.error('Get account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get account'
      });
    }
  }
  
  static async updateAccount(req, res) {
    try {
      const { id } = req.params;
      const { account_name, account_type, description } = req.body;
      const organizationId = req.user.organizationId;
      
      // Check if account exists
      const existingAccount = await ChartOfAccount.getById(id, organizationId);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Account not found'
        });
      }
      
      const account = await ChartOfAccount.update(id, {
        account_name,
        account_type,
        description
      }, organizationId);
      
      res.json({
        success: true,
        message: 'Account updated successfully',
        data: { account }
      });
    } catch (error) {
      console.error('Update account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update account'
      });
    }
  }
  
  static async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;
      
      // Check if account exists
      const existingAccount = await ChartOfAccount.getById(id, organizationId);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Account not found'
        });
      }
      
      const account = await ChartOfAccount.delete(id, organizationId);
      
      res.json({
        success: true,
        message: 'Account deleted successfully',
        data: { account }
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  }

  static async updateAccountStatus(req, res) {
    try {
      const { id } = req.params;
      const { isArchived } = req.body;
      const organizationId = req.user.organizationId;
      
      // Check if account exists
      const existingAccount = await ChartOfAccount.getById(id, organizationId);
      if (!existingAccount) {
        return res.status(404).json({
          success: false,
          message: 'Account not found'
        });
      }
      
      const account = await ChartOfAccount.update(id, {
        isArchived: isArchived
      }, organizationId);
      
      res.json({
        success: true,
        message: 'Account status updated successfully',
        data: { account }
      });
    } catch (error) {
      console.error('Update account status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update account status'
      });
    }
  }
}

module.exports = ChartOfAccountController;
