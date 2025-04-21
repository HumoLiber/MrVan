const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  console.log('Starting Next.js development server...');
  
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096', // Збільшуємо ліміт пам'яті
      PORT: '3000',
    },
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    if (code !== 0) {
      console.log('Restarting server in 5 seconds...');
      setTimeout(startServer, 5000);
    }
  });

  process.on('SIGINT', () => {
    console.log('Gracefully shutting down...');
    server.kill();
    process.exit(0);
  });
}

startServer(); 