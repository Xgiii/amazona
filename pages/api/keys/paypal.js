import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('sigin required');
  }

  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
}

export default handler;
