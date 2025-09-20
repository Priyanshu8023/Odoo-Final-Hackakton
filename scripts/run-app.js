const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Shiv Accounts Application...');
console.log('=====================================');

// Kill any existing processes on ports 3000 and 5173
const { exec } = require('child_process');

exec('netstat -ano | findstr :3000', (error, stdout) => {
  if (stdout) {
    const lines = stdout.split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4 && parts[1].includes(':3000')) {
        const pid = parts[4];
        if (pid && pid !== '0') {
          exec(`taskkill /PID ${pid} /F`, () => {});
        }
      }
    });
  }
});

exec('netstat -ano | findstr :5173', (error, stdout) => {
  if (stdout) {
    const lines = stdout.split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4 && parts[1].includes(':5173')) {
        const pid = parts[4];
        if (pid && pid !== '0') {
          exec(`taskkill /PID ${pid} /F`, () => {});
        }
      }
    });
  }
});

  // Wait a moment for ports to be freed
setTimeout(() => {
  startServers();
  
  // Fallback: Show URLs after 10 seconds regardless
  setTimeout(() => {
    console.log('\n');
    console.log('🌐 Frontend URL: http://localhost:5173/');
    console.log('🛠 API URL: http://localhost:3000/api');
    console.log('❤️ Health Check: http://localhost:3000/health');
    console.log('');
  }, 10000);
}, 2000);

function startServers() {
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
      if (frontendReady) displayURLs();
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
      if (backendReady) displayURLs();
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
}
