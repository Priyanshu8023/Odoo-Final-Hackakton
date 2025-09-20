#!/usr/bin/env node

/**
 * Startup script for the invoicing backend
 * This script helps set up the database and start the server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Invoicing Backend Setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Please copy env.example to .env and configure your database settings.');
  console.log('   cp env.example .env');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!\n');
      runMigration();
    } else {
      console.log('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencies already installed\n');
  runMigration();
}

function runMigration() {
  console.log('🗄️  Running database migration...');
  const migrate = spawn('node', ['src/database/migrate.js'], { stdio: 'inherit', shell: true });
  
  migrate.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Database migration completed successfully!\n');
      startServer();
    } else {
      console.log('❌ Database migration failed. Please check your database connection settings.');
      process.exit(1);
    }
  });
}

function startServer() {
  console.log('🌐 Starting server...');
  const server = spawn('node', ['src/server.js'], { stdio: 'inherit', shell: true });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Server stopped with code ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}
