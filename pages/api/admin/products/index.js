import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res) => {
  const client = await connectToDb();
  const products = await client.db().collection('products').find().toArray();
  client.close();
  res.send(products);
};
export default handler;
