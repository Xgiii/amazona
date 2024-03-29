import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  const client = await connectToDb();
  const ordersCollection = client.db().collection('orders');

  const newOrder = {
    ...req.body,
    user: ObjectId(user._id),
    createdAt: new Intl.DateTimeFormat('en-US').format(Date.now()),
  };

  await ordersCollection.insertOne(newOrder);

  res.status(201).send(newOrder);
}

export default handler;
