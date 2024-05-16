import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BASE_URL } from '../../../../../apiConfig';

interface CustomUser {
  name?: string;
  email?: string;
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          const user = await response.json();
          if (user && response.ok) {
            return user;
          }
          return null;
        } catch (error) {
          console.error('Authorization Error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as CustomUser; 
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      session.user = token.user as CustomUser; 
      return session;
    },
  },
};

export default NextAuth(nextAuthOptions);

export const config = {
  api: {
    bodyParser: false,
  },
};
