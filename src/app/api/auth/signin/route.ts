import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {SignJWT} from 'jose';
import {cookies} from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-jwt-secret');

export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNIN] Request received');

    const {username, password} = await request.json();
    console.log('[SIGNIN] Attempting login for username:', username);

    const user = await db.stuff.findFirst({
      where: {username},
      include: {
        store: {
          select: {
            name: true,
            logo: true,
            id: true,
          },
        },
      },
    });

    console.log('[SIGNIN] User lookup result:', user ? 'Found' : 'Not found');

    if (user && user.password === password) {
      console.log('[SIGNIN] Password verified for user:', username);

      const token = await new SignJWT({
        id: user.id,
        username: user.username,
        role: user.role,
        store_name: user.store.name,
        store_logo: user.store.logo,
        store_id: user.store.id,
      })
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
      console.log('[SIGNIN] JWT generated');

      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      console.log('[SIGNIN] Cookie set successfully');

      // Return redirect URL with the response
      return NextResponse.json(
        {
          message: 'Signed in successfully',
          redirectTo: '/fr', // Default locale home page
        },
        {status: 200}
      );
    }

    console.log('[SIGNIN] Authentication failed for username:', username);
    return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
  } catch (error) {
    console.error('[SIGNIN] Error:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}
