import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const client = await connectToDb();

  const ordersCollection = client.db().collection('orders');
  const productsCollection = client.db().collection('products');
  const usersCollection = client.db().collection('users');

  const ordersCount = await ordersCollection.countDocuments();
  const productsCount = await productsCollection.countDocuments();
  const usersCount = await usersCollection.countDocuments();

  const ordersPriceGroup = await ordersCollection
    .aggregate([
      {
        $group: {
          _id: null,
          sales: {
            $sum: '$totalPrice',
          },
        },
      },
    ])
    .toArray();

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await ordersCollection
    .aggregate([
      {
        $group: {
          _id: '$createdAt',
          totalSales: {
            $sum: '$totalPrice',
          },
        },
      },
    ])
    .toArray();

  client.close();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
}

export default handler;
