import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('Error: signin required');
  }

  const client = await connectToDb();
  const ordersCollection = client.db().collection('orders');

  const order = await ordersCollection.findOne({ _id: ObjectId(req.query.id) });

  if (order) {
    const deliveredOrder = await ordersCollection.updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          isDelivered: true,
          deliveredAt: Date.now(),
        },
      }
    );
    client.close();
    res.send({
      message: 'order delivered successfully',
      order: deliveredOrder,
    });
  } else {
    client.close();
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
