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
    // Try multiple ways to check MongoDB
    const commands = ['mongod --version', 'mongo --version', 'mongosh --version'];
    let completed = false;
    
    const tryNext = (index) => {
      if (index >= commands.length) {
        if (!completed) {
          log('⚠️  MongoDB version check failed, but continuing...', 'yellow');
          log('💡 If MongoDB is running, the connection will be tested during startup', 'blue');
          completed = true;
          resolve(true);
        }
        return;
      }
      
      exec(commands[index], (error) => {
        if (!error && !completed) {
          log('✅ MongoDB is installed', 'green');
          log('🔍 Checking MongoDB connection...', 'blue');
          completed = true;
          resolve(true);
        } else {
          tryNext(index + 1);
        }
      });
    };
    
    tryNext(0);
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
    if (output.includes('API Base URL')) {
      log('📡 Backend API is ready!', 'green');
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
    }
    if (output.includes('http://localhost:5173')) {
      log('🌐 Frontend: http://localhost:5173', 'blue');
    }
    if (output.includes('ready in')) {
      log('🎉 Frontend is ready!', 'green');
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
    log('🔍 Checking MongoDB connection...', 'blue');
    try {
      await runCommand('node scripts/check-mongodb.js', path.join(__dirname, '..'));
      log('✅ MongoDB connection verified', 'green');
    } catch (error) {
      log('⚠️  MongoDB check failed, but continuing...', 'yellow');
      log('💡 The connection will be tested during server startup', 'blue');
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
    
    // Display URLs after a short delay
    setTimeout(() => {
      log('\n', 'reset');
      log('🌐 Frontend URL: http://localhost:5173/', 'blue');
      log('🛠 API URL: http://localhost:3000/api', 'blue');
      log('❤️ Health Check: http://localhost:3000/health', 'blue');
      log('', 'reset');
    }, 3000);
    
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
