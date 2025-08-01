import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting ISO-Hub + JACC Development Servers...\n');

// Check if port 5000 is already in use
import net from 'net';
const server = net.createServer();

server.listen(5000, () => {
  console.log('❌ Port 5000 is already in use!');
  console.log('💡 Please stop any existing services on port 5000 or change the JACC port.\n');
  console.log('📋 Development Setup:');
  console.log('   🌐 ISO-Hub: http://localhost:5173');
  console.log('   🤖 JACC: http://localhost:5000 (PORT CONFLICT)');
  console.log('   🔗 JACC via ISO-Hub: http://localhost:5173/jacc');
  console.log('\n💡 How to fix:');
  console.log('   1. Stop any service running on port 5000');
  console.log('   2. Or modify jacc7/server/index.ts to use a different port');
  console.log('   3. Update the JACC_URL in ISO-Hub if you change the port');
  process.exit(1);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('❌ Port 5000 is already in use!');
    console.log('💡 Please stop any existing services on port 5000 or change the JACC port.\n');
    console.log('📋 Development Setup:');
    console.log('   🌐 ISO-Hub: http://localhost:5173');
    console.log('   🤖 JACC: http://localhost:5000 (PORT CONFLICT)');
    console.log('   🔗 JACC via ISO-Hub: http://localhost:5173/jacc');
    console.log('\n💡 How to fix:');
    console.log('   1. Stop any service running on port 5000');
    console.log('   2. Or modify jacc7/server/index.ts to use a different port');
    console.log('   3. Update the JACC_URL in ISO-Hub if you change the port');
    process.exit(1);
  }
});

// Close the test server
server.close();

// Start JACC server
console.log('📡 Starting JACC on port 5000...\n');
const jaccProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'jacc7'),
  stdio: 'inherit',
  shell: true
});

// Start ISO-Hub server
console.log('📡 Starting ISO-Hub on port 5173...\n');
const isohubProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  jaccProcess.kill();
  isohubProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  jaccProcess.kill();
  isohubProcess.kill();
  process.exit(0);
});

// Handle process errors
jaccProcess.on('error', (err) => {
  console.error('❌ JACC server error:', err);
});

isohubProcess.on('error', (err) => {
  console.error('❌ ISO-Hub server error:', err);
});

console.log('📋 Development Setup:');
console.log('   🌐 ISO-Hub: http://localhost:5173');
console.log('   🤖 JACC: http://localhost:5000');
console.log('   🔗 JACC via ISO-Hub: http://localhost:5173/jacc');
console.log('\n💡 How it works:');
console.log('   1. ISO-Hub runs on port 5173');
console.log('   2. JACC runs on port 5000');
console.log('   3. JACC API calls are proxied through ISO-Hub');
console.log('   4. Access JACC via ISO-Hub navigation or /jacc route');
console.log('\n✅ Both servers will start automatically!');
console.log('   Wait for both servers to be ready before accessing.'); 