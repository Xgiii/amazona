import { hashSync } from 'bcryptjs';
import { connectToDb } from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.send('unsupported method');
    return;
  }

  const { name, email, password } = req.body;

  const client = await connectToDb();
  const usersCollection = client.db().collection('users');

  const allUsers = await usersCollection.find().toArray()

  if(allUsers.find(user => user.email === email)) {
    res.send('User with this email already exists')
    client.close()
    return;
  }

  await usersCollection.insertOne({
    email,
    name,
    password: hashSync(password),
  });

  res.send('Successfully sign up')
  client.close()
}

export default handler;
