import { exec } from 'child_process';

console.log('🔍 Checking for processes on port 5000...');

// For Windows
exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
  if (error) {
    console.log('No processes found on port 5000');
    return;
  }
  
  if (stdout) {
    console.log('Found processes on port 5000:');
    console.log(stdout);
    
    // Extract PID from the output
    const lines = stdout.split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4) {
        const pid = parts[4];
        if (pid && pid !== 'PID') {
          console.log(`🛑 Killing process ${pid}...`);
          exec(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
            if (killError) {
              console.log(`❌ Failed to kill process ${pid}:`, killError.message);
            } else {
              console.log(`✅ Successfully killed process ${pid}`);
            }
          });
        }
      }
    });
  }
});

// For Unix-like systems (Linux/Mac)
exec('lsof -ti:5000', (error, stdout, stderr) => {
  if (error) {
    console.log('No processes found on port 5000 (Unix check)');
    return;
  }
  
  if (stdout) {
    const pids = stdout.trim().split('\n');
    pids.forEach(pid => {
      if (pid) {
        console.log(`🛑 Killing process ${pid}...`);
        exec(`kill -9 ${pid}`, (killError, killStdout, killStderr) => {
          if (killError) {
            console.log(`❌ Failed to kill process ${pid}:`, killError.message);
          } else {
            console.log(`✅ Successfully killed process ${pid}`);
          }
        });
      }
    });
  }
});

console.log('💡 If you still get port conflicts, try:');
console.log('   1. Restart your terminal/command prompt');
console.log('   2. Check Task Manager (Windows) or Activity Monitor (Mac)');
console.log('   3. Run: npm run start-dev'); 