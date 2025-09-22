import {NextRequest, NextResponse} from 'next/server';
import {jwtVerify} from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-jwt-secret');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return new Response('Unauthorized', {status: 401});
    }

    const {payload} = await jwtVerify(token, JWT_SECRET);
    console.log('[CURRENT PAYLOAD]', payload);
    const currentStuff = payload;

    if (!currentStuff) {
      return new Response('[CURRENT]: User not found', {status: 404});
    }

    return NextResponse.json({currentStuff});
  } catch (error) {
    console.error('[CURRENT] Error:', error);
    return new Response('Internal server error', {status: 500});
  }
}
