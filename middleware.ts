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
      // Invalid or expired token — treat as unauthenticated
      console.error('Invalid token in middleware');
    }
  }

  // Public paths (accessible without auth)
  const isAdminLogin = pathname === '/admin/login';
  const isDoctorOnboarding = pathname === '/doctor/onboarding';
  const isPatientOnboarding = pathname === '/patient/onboarding';
  const isLoginPage = pathname === '/login';

  // Paths requiring specific roles
  const requireAdmin = pathname.startsWith('/admin') && !isAdminLogin;
  const requireDoctor = pathname.startsWith('/doctor') && !isDoctorOnboarding;
  const requirePatient = pathname.startsWith('/patient') && !isPatientOnboarding;

  // Redirection logic
  if (requireAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (requireDoctor && role !== 'doctor') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (requirePatient && role !== 'patient') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already authenticated, don't show login pages
  if (isAdminLogin && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isLoginPage && role) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/doctor/:path*',
    '/patient/:path*',
    '/login',
  ],
};
