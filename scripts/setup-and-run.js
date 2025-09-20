const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Complete Setup and Run Process...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMongoDB() {
  return new Promise((resolve) => {
    exec('mongod --version', (error) => {
      if (error) {
        log('❌ MongoDB is not installed or not in PATH', 'red');
        log('Please install MongoDB: https://www.mongodb.com/try/download/community', 'yellow');
        log('Or start MongoDB service: net start MongoDB (Windows)', 'yellow');
        resolve(false);
      } else {
        log('✅ MongoDB is installed', 'green');
        log('🔍 Checking MongoDB connection...', 'blue');
        resolve(true);
      }
    });
  });
}

function checkNodeModules() {
  const backendNodeModules = path.join(__dirname, '..', 'Backend', 'node_modules');
  const frontendNodeModules = path.join(__dirname, '..', 'Fronted', 'node_modules');
  
  const backendExists = fs.existsSync(backendNodeModules);
  const frontendExists = fs.existsSync(frontendNodeModules);
  
  return { backendExists, frontendExists };
}

async function installDependencies() {
  log('📦 Installing dependencies...', 'blue');
  
  // Install root dependencies
  log('Installing root dependencies...', 'yellow');
  await runCommand('npm install', process.cwd());
  
  // Install backend dependencies
  log('Installing backend dependencies...', 'yellow');
  await runCommand('npm install', path.join(__dirname, '..', 'Backend'));
  
  // Install frontend dependencies
  log('Installing frontend dependencies...', 'yellow');
  await runCommand('npm install', path.join(__dirname, '..', 'Fronted'));
}

function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, cwd, stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function setupEnvironment() {
  log('🔧 Setting up environment files...', 'blue');
  
  // Run the existing setup script
  await runCommand('node scripts/setup-env.js', path.join(__dirname, '..'));
}

async function runMigration() {
  log('🗄️ Running database migration...', 'blue');
  
  try {
    await runCommand('npm run migrate', path.join(__dirname, '..', 'Backend'));
    log('✅ Database migration completed', 'green');
  } catch (error) {
    log('❌ Migration failed. Please check MongoDB is running.', 'red');
    throw error;
  }
}

function startServers() {
  log('🚀 Starting both servers...', 'blue');
  
  // Start backend
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..', 'Backend'),
    stdio: 'pipe',
    shell: true
  });
  
  // Start frontend
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..', 'Fronted'),
    stdio: 'pipe',
    shell: true
  });
  
  // Handle backend output
  backend.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server is running')) {
      log('✅ Backend server started successfully', 'green');
    }
    if (output.includes('MongoDB connected successfully')) {
      log('✅ MongoDB connected to Shiv_account database', 'green');
    }
    if (output.includes('Ready to accept database operations')) {
      log('🎉 Database operations ready!', 'green');
    }
  });
  
  backend.stderr.on('data', (data) => {
    const output = data.toString();
    if (!output.includes('Warning')) {
      log(`Backend: ${output}`, 'red');
    }
  });
  
  // Handle frontend output
  frontend.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Local:')) {
      log('✅ Frontend server started successfully', 'green');
      log('🌐 Frontend: http://localhost:5173', 'blue');
    }
  });
  
  frontend.stderr.on('data', (data) => {
    const output = data.toString();
    if (!output.includes('Warning')) {
      log(`Frontend: ${output}`, 'red');
    }
  });
  
  // Handle process exit
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down servers...', 'yellow');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
  
  // Keep the process running
  process.on('exit', () => {
    backend.kill();
    frontend.kill();
  });
}

async function main() {
  try {
    // Check MongoDB
    const mongoInstalled = await checkMongoDB();
    if (!mongoInstalled) {
      process.exit(1);
    }
    
    // Check if dependencies are installed
    const { backendExists, frontendExists } = checkNodeModules();
    
    if (!backendExists || !frontendExists) {
      log('📦 Dependencies not found. Installing...', 'yellow');
      await installDependencies();
    } else {
      log('✅ Dependencies already installed', 'green');
    }
    
    // Setup environment
    await setupEnvironment();
    
    // Run migration
    await runMigration();
    
    // Start servers
    startServers();
    
    log('\n🎉 Setup complete! Both servers are starting...', 'green');
    log('📋 Available URLs:', 'blue');
    log('  - Frontend: http://localhost:5173', 'blue');
    log('  - Backend API: http://localhost:3000/api', 'blue');
    log('  - Health Check: http://localhost:3000/health', 'blue');
    log('\n🔑 Default Admin Login:', 'blue');
    log('  - Email: admin@invoicing.com', 'blue');
    log('  - Password: admin123', 'blue');
    log('\nPress Ctrl+C to stop both servers', 'yellow');
    
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
