import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectDB() {
  if (db) return db;

  const client = new MongoClient(process.env.MONGODB_URI as string);

  await client.connect();
  db = client.db("necore");

  console.log("✅ MongoDB connected");
  console.log("MONGO URI:", process.env.MONGODB_URI);

  return db;
}