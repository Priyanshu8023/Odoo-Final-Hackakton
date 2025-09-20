const { connectDB, mongoose } = require('../config/database');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Product = require('../models/Product');
const Tax = require('../models/Tax');
const ChartOfAccount = require('../models/ChartOfAccount');

async function migrate() {
  try {
    console.log('🗄️  Starting Database Migration...');
    console.log('=====================================');
    console.log('📊 Database: Shiv_account');
    console.log('🌐 MongoDB: localhost:27017');
    console.log('=====================================');

    // Connect to MongoDB
    await connectDB();

    // Create default organization
    console.log('🏢 Creating default organization...');
    const organization = await createDefaultOrganization();

    // Create default admin user
    console.log('👤 Creating default admin user...');
    await createDefaultAdminUser(organization._id);

    // Create default chart of accounts
    console.log('📋 Creating chart of accounts...');
    await createDefaultChartOfAccounts(organization._id);

    // Create default tax rates
    console.log('💰 Creating default tax rates...');
    await createDefaultTaxes(organization._id);

    console.log('=====================================');
    console.log('✅ Migration completed successfully!');
    console.log('🎉 Database is ready for use!');
    console.log('=====================================');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('💡 Please ensure MongoDB is running on localhost:27017');
  } finally {
    await mongoose.connection.close();
  }
}

async function createDefaultOrganization() {
  const existingOrg = await Organization.findOne({ name: 'Default Organization' });
  
  if (existingOrg) {
    console.log('Default organization already exists');
    return existingOrg;
  }

  const organization = new Organization({
    name: 'Default Organization',
    address: {
      street: '123 Business Street',
      city: 'Business City',
      state: 'Business State',
      pincode: '12345'
    }
  });

  await organization.save();
  console.log('Default organization created');
  return organization;
}

async function createDefaultAdminUser(organizationId) {
  const adminEmail = 'admin@invoicing.com';
  const adminPassword = 'admin123';

  const existingUser = await User.findOne({ email: adminEmail });
  
  if (existingUser) {
    console.log('Admin user already exists');
    return existingUser;
  }

  const user = new User({
    organizationId,
    name: 'Admin User',
    email: adminEmail,
    passwordHash: adminPassword, // Will be hashed by pre-save middleware
    role: 'admin',
    isActive: true
  });

  await user.save();
  console.log('Default admin user created:');
  console.log('Email: admin@invoicing.com');
  console.log('Password: admin123');
  return user;
}

async function createDefaultChartOfAccounts(organizationId) {
  const accounts = [
    { accountName: 'Cash', accountType: 'asset', isSystemAccount: true },
    { accountName: 'Bank Account', accountType: 'asset', isSystemAccount: true },
    { accountName: 'Accounts Receivable', accountType: 'asset', isSystemAccount: true },
    { accountName: 'Inventory', accountType: 'asset', isSystemAccount: true },
    { accountName: 'Accounts Payable', accountType: 'liability', isSystemAccount: true },
    { accountName: 'Sales Revenue', accountType: 'income', isSystemAccount: true },
    { accountName: 'Purchase Expenses', accountType: 'expense', isSystemAccount: true },
    { accountName: 'Operating Expenses', accountType: 'expense', isSystemAccount: true },
    { accountName: 'Owner Equity', accountType: 'equity', isSystemAccount: true }
  ];

  for (const accountData of accounts) {
    const existing = await ChartOfAccount.findOne({ 
      organizationId, 
      accountName: accountData.accountName 
    });

    if (!existing) {
      const account = new ChartOfAccount({
        organizationId,
        ...accountData
      });
      await account.save();
    }
  }

  console.log('Default chart of accounts created');
}

async function createDefaultTaxes(organizationId) {
  const taxes = [
    { 
      name: 'GST 18%', 
      computationMethod: 'percentage', 
      rate: 18.00, 
      applicableOn: ['sales', 'purchase'] 
    },
    { 
      name: 'GST 12%', 
      computationMethod: 'percentage', 
      rate: 12.00, 
      applicableOn: ['sales', 'purchase'] 
    },
    { 
      name: 'GST 5%', 
      computationMethod: 'percentage', 
      rate: 5.00, 
      applicableOn: ['sales', 'purchase'] 
    },
    { 
      name: 'GST 0%', 
      computationMethod: 'percentage', 
      rate: 0.00, 
      applicableOn: ['sales', 'purchase'] 
    }
  ];

  for (const taxData of taxes) {
    const existing = await Tax.findOne({ 
      organizationId, 
      name: taxData.name 
    });

    if (!existing) {
      const tax = new Tax({
        organizationId,
        ...taxData
      });
      await tax.save();
    }
  }

  console.log('Default tax rates created');
}

migrate();

