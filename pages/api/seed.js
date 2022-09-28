import data from '../../utils/data';
import { connectToDb } from '../../utils/db';

export default async function handler(req, res) {
  const client = await connectToDb();
  const userCollection = client.db().collection('users');
  await userCollection.deleteMany();
  await userCollection.insertMany(data.users);
  client.close();
  res.send({message: 'seeded successfully'})
}
