import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNOUT] Request received');

    // Clear the token cookie
    cookies().set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Expire the cookie immediately
    });

    console.log('[SIGNOUT] Token cookie cleared');

    return NextResponse.json({message: 'Signed out successfully'}, {status: 200});
  } catch (error) {
    console.error('[SIGNOUT] Error:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}
