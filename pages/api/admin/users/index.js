import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  const client = await connectToDb();
  const usersCollection = client.db().collection('users');
  const users = await usersCollection.find().toArray();
  client.close();
  res.send(users);
};

export default handler;
