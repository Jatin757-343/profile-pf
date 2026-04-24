import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://kumarjatin2192005_db_user:PortfolioDB%232024@ac-eygr9wf-shard-00-00.dvspsdi.mongodb.net:27017,ac-eygr9wf-shard-00-01.dvspsdi.mongodb.net:27017,ac-eygr9wf-shard-00-02.dvspsdi.mongodb.net:27017/videoeditor?ssl=true&replicaSet=atlas-gxxp0v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    await client.connect();
    const db = client.db('videoeditor');
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
