import {jwtVerify} from 'jose';
import {cookies} from 'next/headers';
import {CurrentStuffType} from '~/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const getCurrentStuff = async () => {
  const token = cookies().get('token')?.value;
  if (!token) {
    console.error('[LIB/CURRENT] Token not found');
    return null;
  }
  try {
    const {payload} = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      store: {
        name: payload.store_name,
        logo: payload.store_logo,
        id: payload.store_id,
      },
    } as CurrentStuffType;
  } catch (error) {
    console.error('[getCurrentStuff] Error:', error);
    throw new Error('Failed to verify token');
  }
};
