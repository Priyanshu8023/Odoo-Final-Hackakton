const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database schema created successfully!');
    
    // Create default admin user if it doesn't exist
    const bcrypt = require('bcryptjs');
    const adminEmail = 'admin@invoicing.com';
    const adminPassword = 'admin123';
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (result.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [adminEmail, hashedPassword, 'Admin']
      );
      console.log('Default admin user created:');
      console.log('Email: admin@invoicing.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create default chart of accounts
    await createDefaultChartOfAccounts();
    
    // Create default tax rates
    await createDefaultTaxes();
    
    // Create default product categories
    await createDefaultProductCategories();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

async function createDefaultChartOfAccounts() {
  const accounts = [
    { name: 'Cash', type: 'Asset', description: 'Cash in hand' },
    { name: 'Bank Account', type: 'Asset', description: 'Primary bank account' },
    { name: 'Accounts Receivable', type: 'Asset', description: 'Money owed by customers' },
    { name: 'Inventory', type: 'Asset', description: 'Stock on hand' },
    { name: 'Accounts Payable', type: 'Liability', description: 'Money owed to vendors' },
    { name: 'Sales Revenue', type: 'Income', description: 'Revenue from sales' },
    { name: 'Purchase Expenses', type: 'Expense', description: 'Cost of goods purchased' },
    { name: 'Operating Expenses', type: 'Expense', description: 'General operating expenses' },
    { name: 'Owner Equity', type: 'Equity', description: 'Owner investment' }
  ];
  
  for (const account of accounts) {
    const existing = await pool.query(
      'SELECT id FROM chart_of_accounts WHERE account_name = $1',
      [account.name]
    );
    
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO chart_of_accounts (account_name, account_type, description) VALUES ($1, $2, $3)',
        [account.name, account.type, account.description]
      );
    }
  }
  
  console.log('Default chart of accounts created');
}

async function createDefaultTaxes() {
  const taxes = [
    { name: 'GST 18%', method: 'Percentage', rate: 18.00, applicable: 'Both' },
    { name: 'GST 12%', method: 'Percentage', rate: 12.00, applicable: 'Both' },
    { name: 'GST 5%', method: 'Percentage', rate: 5.00, applicable: 'Both' },
    { name: 'GST 0%', method: 'Percentage', rate: 0.00, applicable: 'Both' }
  ];
  
  for (const tax of taxes) {
    const existing = await pool.query(
      'SELECT id FROM taxes WHERE tax_name = $1',
      [tax.name]
    );
    
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO taxes (tax_name, computation_method, rate, applicable_on) VALUES ($1, $2, $3, $4)',
        [tax.name, tax.method, tax.rate, tax.applicable]
      );
    }
  }
  
  console.log('Default tax rates created');
}

async function createDefaultProductCategories() {
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Food & Beverages',
    'Services',
    'Office Supplies',
    'Furniture',
    'Other'
  ];
  
  for (const category of categories) {
    const existing = await pool.query(
      'SELECT id FROM product_categories WHERE name = $1',
      [category]
    );
    
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO product_categories (name) VALUES ($1)',
        [category]
      );
    }
  }
  
  console.log('Default product categories created');
}

migrate();

