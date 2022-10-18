import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  if (req.method === 'GET') {
    const client = await connectToDb();
    const ordersCollection = client.db().collection('orders');

    const orders = await await ordersCollection
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
      ])
      .toArray();

    client.close();

    res.send(orders);
  } else {
    return res.staus(400).send({ message: 'Method not allowed' });
  }
}

export default handler;
