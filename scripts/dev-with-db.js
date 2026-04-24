const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting MongoDB Memory Server...');
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'videoeditor' }
  });
  const uri = mongod.getUri();
  console.log('MongoDB Memory Server ready at:', uri);

  // Write URI to .env.local
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  const adminMatch = envContent.match(/ADMIN_PASSWORD=(.+)/);
  const adminPass = adminMatch ? adminMatch[1] : 'admin123';
  fs.writeFileSync(envPath, `MONGODB_URI=${uri}\nADMIN_PASSWORD=${adminPass}\n`);
  console.log('Updated .env.local with local DB URI');

  // Start Next.js dev server
  console.log('Starting Next.js dev server...\n');
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  const shutdown = async () => {
    console.log('\nShutting down...');
    child.kill();
    await mongod.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(err => {
  console.error('Failed to start dev environment:', err);
  process.exit(1);
});

