import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('signin required');
  }

  const client = await connectToDb();
  const ordersColleciton = client.db().collection('orders');

  const order = await ordersColleciton.findOne({ _id: ObjectId(req.query.id) });
  client.close();
  res.send(order);
}

export default handler;
