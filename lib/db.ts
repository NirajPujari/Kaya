import { MongoClient } from "mongodb";

const uri = process.env.DB_URL!;
const dbName = process.env.DB_NAME!;

if (!uri) throw new Error("DB_URL is missing");
if (!dbName) throw new Error("DB_NAME is missing");

const client: MongoClient = new MongoClient(uri);
const clientPromise: Promise<MongoClient> = client.connect();

export async function getDb() {
  const client: MongoClient = await clientPromise;
  return client.db(dbName);
}
