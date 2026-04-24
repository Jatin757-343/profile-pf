const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function getEnvVar(name) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return undefined;
  const content = fs.readFileSync(envPath, 'utf-8');
  const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return match ? match[1].trim() : undefined;
}

const uri = getEnvVar('MONGODB_URI') || process.env.MONGODB_URI;

async function test() {
  if (!uri) {
    console.error('No MONGODB_URI found. Run: node scripts/dev-with-db.js');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('videoeditor');
    const collections = await db.listCollections().toArray();
    console.log('Connected! Collections:', collections.map(c => c.name));
    const siteData = db.collection('siteData');
    const doc = await siteData.findOne({ _id: 'siteData' });
    console.log('siteData doc:', doc ? 'Found' : 'Not found');
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.close();
  }
}

test();

