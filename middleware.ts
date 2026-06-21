import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-dev-only';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  let role: string | null = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      });
      role = (payload.user as any)?.role || null;
    } catch (error) {
      console.error('Invalid token in middleware');
    }
  }

  // Paths requiring specific roles
  const requireAdmin = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const requireDoctor = pathname.startsWith('/doctor') && !pathname.startsWith('/doctor/onboarding');
  const requirePatient = pathname.startsWith('/patient') && !pathname.startsWith('/patient/onboarding');

  // Redirection logic
  if (requireAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL(role ? `/${role}/dashboard` : '/admin/login', request.url));
  }

  if (requireDoctor && role !== 'doctor') {
    return NextResponse.redirect(new URL(role ? `/${role}/dashboard` : '/login', request.url));
  }

  if (requirePatient && role !== 'patient') {
    return NextResponse.redirect(new URL(role ? `/${role}/dashboard` : '/login', request.url));
  }

  // If trying to access login while already authenticated
  if ((pathname === '/login' || pathname === '/admin/login') && role) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/doctor/:path*',
    '/patient/:path*',
    '/login'
  ],
};
