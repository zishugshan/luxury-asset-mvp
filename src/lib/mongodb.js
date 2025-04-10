import { MongoClient } from "mongodb";

const uri = "mongodb+srv://luxury-asset-mvp:luxury-asset-mvp@dev-qz.lohgxhs.mongodb.net/?retryWrites=true&w=majority&appName=dev-qz"; 
const client = new MongoClient(uri);
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  await client.connect();
  cachedDb = client.db("luxury_assets");
  return cachedDb;
}
