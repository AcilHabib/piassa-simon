import {NextRequest, NextResponse} from 'next/server';
import {jwtVerify} from 'jose'; // Edge-compatible JWT library
import createMiddleware from 'next-intl/middleware';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-jwt-secret');

// Update public routes to include all variations
const publicRoutes = [
  '/api/auth/signin',
  '/api/auth/signout',
  '/auth/signin',
  '/signin', // Add base signin route
];

const routing = {
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
};

const i18nMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  console.log('[MIDDLEWARE] Request path:', req.nextUrl.pathname);

  // Check if the path without locale is public
  const pathWithoutLocale = req.nextUrl.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  const isPublicRoute = publicRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );

  console.log('[MIDDLEWARE] Path without locale:', pathWithoutLocale);
  console.log('[MIDDLEWARE] Is public route:', isPublicRoute);

  if (isPublicRoute) {
    console.log('[MIDDLEWARE] Allowing public route access');
    return i18nMiddleware(req);
  }

  const token = req.cookies.get('token')?.value;
  console.log('[MIDDLEWARE] Token present:', !!token);

  if (!token) {
    console.log('[MIDDLEWARE] No token found, redirecting to signin');
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/signin`, req.url));
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    console.log('[MIDDLEWARE] Token verified successfully:', verified.payload);
    return i18nMiddleware(req);
  } catch (error) {
    console.log('[MIDDLEWARE] Token verification failed:', error.message);
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/signin`, req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
