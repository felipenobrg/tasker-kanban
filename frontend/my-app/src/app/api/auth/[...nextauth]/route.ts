import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '../../../../../apiConfig';

interface CustomUser {
  name?: string;
  email?: string;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const authOptions: NextAuthOptions = {
      providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials) {
            try {
              const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
              });

              const user = await response.json();
              if (response.ok && user) {
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
        signOut: '/login',
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

    await NextAuth(req, res, authOptions);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const nextAuthConfig = {
  api: {
    bodyParser: false,
  },
};
