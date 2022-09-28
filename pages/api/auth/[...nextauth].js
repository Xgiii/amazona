import { compareSync } from 'bcryptjs';
import NextAuth from 'next-auth/next';
import { connectToDb } from '../../../utils/db';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDb();
        const user = await client.db().collection('users').findOne({
          email: credentials.email,
        });
        client.close();
        if (user && compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password')
      },
    }),
  ],
});
