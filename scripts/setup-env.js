const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...');

// Backend .env
const backendEnvPath = path.join(__dirname, '..', 'Backend', '.env');
const backendEnvExamplePath = path.join(__dirname, '..', 'Backend', 'env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('✅ Created Backend/.env from env.example');
  } else {
    const backendEnvContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/Shiv_account
DB_HOST=localhost
DB_PORT=27017
DB_NAME=Shiv_account

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173`;

    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created Backend/.env');
  }
} else {
  console.log('ℹ️  Backend/.env already exists');
}

// Frontend .env
const frontendEnvPath = path.join(__dirname, '..', 'Fronted', '.env');
const frontendEnvExamplePath = path.join(__dirname, '..', 'Fronted', 'env.example');

if (!fs.existsSync(frontendEnvPath)) {
  if (fs.existsSync(frontendEnvExamplePath)) {
    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
    console.log('✅ Created Fronted/.env from env.example');
  } else {
    const frontendEnvContent = `# Backend API URL
REACT_APP_API_URL=http://localhost:3000/api

# Development Configuration
REACT_APP_ENV=development`;

    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created Fronted/.env');
  }
} else {
  console.log('ℹ️  Fronted/.env already exists');
}

console.log('🎉 Environment setup complete!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run migration: cd Backend && npm run migrate');
console.log('3. Start the application: npm run dev');
console.log('');
console.log('🔗 URLs:');
console.log('- Frontend: http://localhost:5173');
console.log('- Backend API: http://localhost:3000/api');
console.log('- Default admin login: admin@invoicing.com / admin123');
