import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
     const token = request.cookies.get('admin_token')?.value;
     if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
  }

  // Protect tenant /dashboard route
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('tenant_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*'],
};
