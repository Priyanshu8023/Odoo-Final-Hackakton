const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Accounting System...');
console.log('=====================================');

// Start backend
console.log('🔧 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'Backend'),
  stdio: 'pipe',
  shell: true
});

// Start frontend
console.log('📱 Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'Fronted'),
  stdio: 'pipe',
  shell: true
});

let backendReady = false;
let frontendReady = false;

// Handle backend output
backend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Server is running')) {
    backendReady = true;
    console.log('✅ Backend server started successfully');
    displayURLs();
  }
  if (output.includes('MongoDB connected successfully')) {
    console.log('✅ MongoDB connected to Shiv_account database');
  }
});

backend.stderr.on('data', (data) => {
  const output = data.toString();
  if (!output.includes('Warning')) {
    console.log(`Backend: ${output}`);
  }
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Local:')) {
    frontendReady = true;
    console.log('✅ Frontend server started successfully');
    displayURLs();
  }
  if (output.includes('http://localhost:5173')) {
    console.log('🌐 Frontend available at: http://localhost:5173');
  }
});

frontend.stderr.on('data', (data) => {
  const output = data.toString();
  if (!output.includes('Warning')) {
    console.log(`Frontend: ${output}`);
  }
});

  function displayURLs() {
    if (backendReady && frontendReady) {
      console.log('\n');
      console.log('🌐 Frontend URL: http://localhost:5173/');
      console.log('🛠 API URL: http://localhost:3000/api');
      console.log('❤️ Health Check: http://localhost:3000/health');
      console.log('');
    }
  }

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Keep the process running
process.on('exit', () => {
  backend.kill();
  frontend.kill();
});
