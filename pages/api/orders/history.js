import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'sigin required' });
  }

  const { user } = session;
  const client = await connectToDb();
  const ordersCollection = client.db().collection('orders');

  const orders = await ordersCollection
    .find({ user: ObjectId(user._id) })
    .toArray();
  client.close();
  res.send(orders);
}

export default handler;
