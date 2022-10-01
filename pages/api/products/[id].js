import { ObjectId } from 'mongodb';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  const client = await connectToDb();
  const productsCollection = client.db().collection('products');

  const product = await productsCollection.findOne({_id: ObjectId(req.query.id)});

  client.close();

  res.send(product);
}

export default handler;
