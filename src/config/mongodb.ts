import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const client = new MongoClient(uri);

  await client.connect();
  db = client.db("necore");

  console.log("✅ MongoDB connected");
  console.log("MONGO_URI:", uri);

  return db;
}