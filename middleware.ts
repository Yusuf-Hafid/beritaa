import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  const isLoginRoute = pathname === '/admin' || pathname === '/admin/';
  const isDashboardRoute =
    pathname === '/admin/dashboard' ||
    pathname.startsWith('/admin/dashboard/');

  if (isDashboardRoute && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && session) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin/dashboard';
    dashboardUrl.search = '';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
