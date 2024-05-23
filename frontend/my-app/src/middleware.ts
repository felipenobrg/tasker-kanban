import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';

const protectedRoutes = ['/'];

export default async function AuthMiddleware(req: NextApiRequest): Promise<NextResponse> {
  if (!protectedRoutes.some((path) => req.url === path)) {
    return NextResponse.next();
  } else {
    const session = await getSession({ req });
    if (!session) {
      const loginUrl = new URL('/login', `http://${req.headers.host}`);
      return NextResponse.redirect(loginUrl.href);
    }
  }
  return NextResponse.next();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
