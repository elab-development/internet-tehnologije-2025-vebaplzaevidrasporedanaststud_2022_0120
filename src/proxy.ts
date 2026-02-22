import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get('auth_token')?.value;

    // Initializing response
    const response = NextResponse.next();

    // Content Security Policy (CSP)
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' https://*;///////ovde se navodi za eksterni api
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isStudentPage = pathname.startsWith('/student');
    const isAdminPage = pathname.startsWith('/admin');
    const isProtectedPage = isStudentPage || isAdminPage;

    // Handle Unauthenticated users
    if (isProtectedPage && !authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Handle Authenticated users (RBAC & Redirects)
    if (authToken) {
        const payload = await verifyToken(authToken);

        // If token is invalid, clear it and redirect to login
        if (!payload) {
            const loginUrl = new URL('/login', request.url);
            const redirectResponse = NextResponse.redirect(loginUrl);
            redirectResponse.cookies.delete('auth_token');
            return redirectResponse;
        }

        // Redirect already authenticated users away from login/register
        if (isAuthPage) {
            const dashboardUrl = new URL(
                payload.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
                request.url
            );
            return NextResponse.redirect(dashboardUrl);
        }

        // RBAC Enforcement
        if (isAdminPage && payload.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }

        if (isStudentPage && payload.role !== 'STUDENT') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        // Handle root path redirects (/student -> /student/dashboard)
        if (pathname === '/student' || pathname === '/student/') {
            return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }

        if (pathname === '/admin' || pathname === '/admin/') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return response;
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
        '/login',
        '/register'
    ],
};
