const mongoose = require('mongoose');
const ChartOfAccount = require('../models/ChartOfAccount');
const Organization = require('../models/Organization');
const { connectDB } = require('../config/database');

const seedChartOfAccounts = async () => {
  await connectDB();
  console.log('🌱 Seeding Chart of Accounts...');

  try {
    const organization = await Organization.findOne();
    if (!organization) {
      console.error('No organization found. Please create an organization first.');
      return;
    }

    await ChartOfAccount.deleteMany({ organizationId: organization._id });
    console.log('🗑️  Cleared existing chart of accounts');

    const accountsData = [
      // Assets
      {
        organizationId: organization._id,
        account_name: 'Cash',
        account_type: 'asset',
        description: 'Cash in hand and bank accounts',
        isSystemAccount: true
      },
      {
        organizationId: organization._id,
        account_name: 'Accounts Receivable',
        account_type: 'asset',
        description: 'Money owed by customers'
      },
      {
        organizationId: organization._id,
        account_name: 'Inventory',
        account_type: 'asset',
        description: 'Stock of goods for sale'
      },
      {
        organizationId: organization._id,
        account_name: 'Equipment',
        account_type: 'asset',
        description: 'Office equipment and machinery'
      },
      {
        organizationId: organization._id,
        account_name: 'Furniture',
        account_type: 'asset',
        description: 'Office furniture and fixtures'
      },
      // Liabilities
      {
        organizationId: organization._id,
        account_name: 'Accounts Payable',
        account_type: 'liability',
        description: 'Money owed to suppliers'
      },
      {
        organizationId: organization._id,
        account_name: 'Loans Payable',
        account_type: 'liability',
        description: 'Bank loans and other borrowings'
      },
      {
        organizationId: organization._id,
        account_name: 'Accrued Expenses',
        account_type: 'liability',
        description: 'Expenses incurred but not yet paid'
      },
      // Income
      {
        organizationId: organization._id,
        account_name: 'Sales Revenue',
        account_type: 'income',
        description: 'Revenue from sales of goods and services',
        isSystemAccount: true
      },
      {
        organizationId: organization._id,
        account_name: 'Service Revenue',
        account_type: 'income',
        description: 'Revenue from service provision'
      },
      // Expenses
      {
        organizationId: organization._id,
        account_name: 'Cost of Goods Sold',
        account_type: 'expense',
        description: 'Direct costs of producing goods',
        isSystemAccount: true
      },
      {
        organizationId: organization._id,
        account_name: 'Office Rent',
        account_type: 'expense',
        description: 'Monthly office rent payments'
      },
      {
        organizationId: organization._id,
        account_name: 'Utilities',
        account_type: 'expense',
        description: 'Electricity, water, internet bills'
      },
      {
        organizationId: organization._id,
        account_name: 'Salaries',
        account_type: 'expense',
        description: 'Employee salary payments'
      },
      {
        organizationId: organization._id,
        account_name: 'Marketing',
        account_type: 'expense',
        description: 'Advertising and marketing expenses'
      },
      // Equity
      {
        organizationId: organization._id,
        account_name: 'Owner\'s Equity',
        account_type: 'equity',
        description: 'Owner\'s investment in the business',
        isSystemAccount: true
      },
      {
        organizationId: organization._id,
        account_name: 'Retained Earnings',
        account_type: 'equity',
        description: 'Accumulated profits retained in the business'
      }
    ];

    const createdAccounts = await ChartOfAccount.insertMany(accountsData);
    console.log(`✅ Created ${createdAccounts.length} chart of accounts`);
    console.log('=====================================');
    console.log('🎉 Chart of Accounts seeding completed successfully!');
    console.log('=====================================');
  } catch (error) {
    console.error('Error seeding chart of accounts:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedChartOfAccounts();

