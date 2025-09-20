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
        [adminEmail, hashedPassword, 'admin']
      );
      console.log('Default admin user created:');
      console.log('Email: admin@invoicing.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();


