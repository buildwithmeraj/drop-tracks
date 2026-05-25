import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGODB_URI in your environment variables.");
}

const options = {
  family: 4,
  serverSelectionTimeoutMS: 10000,
};

if (dbName) {
  options.dbName = dbName;
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }

  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName || undefined);
}

export default clientPromise;
