import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  }

  if (req.method === 'GET') {
    return getHandler(req, res);
  }

  if (req.method === 'PUT') {
    return putHandler(req, res);
  }

  return res.status(400).send({ message: 'Method not allowed' });
};

const getHandler = async (req, res) => {
  const client = await connectToDb();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ _id: ObjectId(req.query.id) });
  res.send(user);
};

const putHandler = async (req, res) => {
  const client = await connectToDb();
  const usersCollection = client.db().collection('users');

  const { name, email, isAdmin } = req.body;

  try {
    await usersCollection.updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          name,
          email,
          isAdmin,
        },
      }
    );

    res.send({ message: 'User Successfully Updated' });
  } catch (error) {
    res.send(error);
  }
};

const deleteHandler = async (req, res) => {
  const client = await connectToDb();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ _id: ObjectId(req.query.id) });
  if (user) {
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can not delete admin' });
    }
    await usersCollection.deleteOne({ _id: ObjectId(req.query.id) });
    client.close();
    res.send({ message: 'User Deleted' });
  } else {
    client.close();
    res.status(404).send({ message: 'User Not Found' });
  }
};

export default handler;
