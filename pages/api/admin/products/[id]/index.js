import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (req, res) => {
  const client = await connectToDb();
  const product = await client
    .db()
    .collection('products')
    .findOne({ _id: ObjectId(req.query.id) });

  if (product) {
    await client
      .db()
      .collection('products')
      .deleteOne({ _id: ObjectId(req.query.id) });
    client.close();
    res.send({ message: 'Product deleted successfully' });
  } else {
    client.close();
    res.status(404).send({ message: 'Product not found' });
  }
};

const getHandler = async (req, res) => {
  const client = await connectToDb();
  const product = await client
    .db()
    .collection('products')
    .findOne({ _id: ObjectId(req.query.id) });
  client.close();
  res.send(product);
};

const putHandler = async (req, res) => {
  const client = await connectToDb();
  const productsCollection = client.db().collection('products');
  const product = await productsCollection.findOne({
    _id: ObjectId(req.query.id),
  });
  if (product) {
    await productsCollection.updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          name: req.body.name,
          slug: req.body.slug,
          price: +req.body.price,
          category: req.body.category,
          image: req.body.image,
          brand: req.body.brand,
          countInStock: req.body.countInStock,
          description: req.body.description,
        },
      }
    );
    client.close();
    res.send({ message: 'Product updated successfully' });
  } else {
    client.close();
    res.status(404).send({ message: 'Product not found' });
  }
};
export default handler;
