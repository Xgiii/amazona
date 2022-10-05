import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Error: sigin required');
  }

  const client = await connectToDb();
  const ordersColleciton = client.db().collection('orders');

  const order = await ordersColleciton.findOne({
    _id: ObjectId(req.query.id),
  });
  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: 'Error: order is already paid' });
    }
    const paidOrder = await ordersColleciton.updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
          },
        },
      }
    );
    client.close();
    res.send({ message: 'order paid successfully', order: paidOrder });
  } else {
    client.close();
    res.status(404).send({ message: 'Error: order not found' });
  }
}

export default handler;
