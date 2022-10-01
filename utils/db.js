import { MongoClient } from 'mongodb';

export async function connectToDb() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

export function convertDocToObj(doc) {
  doc._id = doc._id.toString();

  return doc;
}
