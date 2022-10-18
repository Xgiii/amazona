import { hashSync } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'sigin required' });
  }

  const { user } = session;

  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({ message: 'Validation error' });
    return;
  }

  const client = await connectToDb();
  const usersCollection = client.db().collection('users');

  await usersCollection.updateOne(
    { _id: ObjectId(user._id) },
    {
      $set: {
        name,
        email,
        if(password) {
          hashSync(password);
        },
      },
    }
  );

  client.close();
  res.send({ message: 'User updated' });

  return res.status(400).send({ message: `${req.method} not supported` });
}

export default handler;
