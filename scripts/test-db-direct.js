const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://kumarjatin2192005_db_user:PortfolioDB%232024@ac-eygr9wf-shard-00-00.dvspsdi.mongodb.net:27017,ac-eygr9wf-shard-00-01.dvspsdi.mongodb.net:27017,ac-eygr9wf-shard-00-02.dvspsdi.mongodb.net:27017/videoeditor?ssl=true&replicaSet=atlas-gxxp0v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db('videoeditor');
    const collections = await db.listCollections().toArray();
    console.log('Connected! Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('Direct connection failed:', err.message);
  } finally {
    await client.close();
  }
}

test();

