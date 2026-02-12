import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get('auth_token')?.value;

    // Initializing response
    const response = NextResponse.next();

    // Security Headers 

    // Content Security Policy (CSP)
    // - connect-src: allows self and any HTTPS API (for external APIs)
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

    // Route Protection 
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isProtectedPage = pathname.startsWith('/student') || pathname.startsWith('/admin');

    // Redirect unauthenticated users
    if (isProtectedPage && !authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect already authenticated users away from login/register
    //smanjuju se opcije hakera
    if (isAuthPage && authToken) {
       const dashboardUrl = new URL('/student/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
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
