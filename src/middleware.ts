// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';
import { createServerClient } from '@lib/supabase/client';

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Authentication middleware - parse auth tokens and set context.locals
 */
const authMiddleware = defineMiddleware(async (context, next) => {
    try {
        const supabase = createServerClient(context.cookies);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user && !error) {
            context.locals.user = user;
            context.locals.isAuthenticated = true;
        } else {
            context.locals.user = null;
            context.locals.isAuthenticated = false;
        }
    } catch (e) {
        context.locals.user = null;
        context.locals.isAuthenticated = false;
    }

    return next();
});

/**
 * Protected routes middleware - redirect unauthenticated users
 */
const protectedRoutesMiddleware = defineMiddleware(async (context, next) => {
    const protectedPaths = ['/account', '/checkout', '/admin'];
    const adminPaths = ['/admin'];

    const isProtected = protectedPaths.some(path =>
        context.url.pathname.startsWith(path)
    );
    const isAdminRoute = adminPaths.some(path =>
        context.url.pathname.startsWith(path)
    );

    // Check authentication for protected routes
    if (isProtected && !context.locals.isAuthenticated) {
        return context.redirect(
            `/auth/login?redirect=${encodeURIComponent(context.url.pathname)}`
        );
    }

    // Check admin role for admin routes
    if (isAdminRoute && context.locals.user) {
        const role = context.locals.user.user_metadata?.role;
        const hasAdminRole = role === 'admin' || role === 'super_admin';

        if (!hasAdminRole) {
            return new Response('Forbidden', { status: 403 });
        }
    }

    return next();
});

/**
 * Security headers middleware
 */
const securityHeadersMiddleware = defineMiddleware(async (context, next) => {
    const response = await next();

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // CSP in production
    if (import.meta.env.PROD) {
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https: blob:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
            "frame-ancestors 'none';"
        );
    }

    return response;
});

/**
 * Rate limiting middleware for API routes
 */
const rateLimitMiddleware = defineMiddleware(async (context, next) => {
    // Only rate limit API routes and actions
    if (!context.url.pathname.startsWith('/api') &&
        !context.url.pathname.startsWith('/_actions')) {
        return next();
    }

    const clientIP = context.request.headers.get('x-forwarded-for') ||
        context.clientAddress ||
        'unknown';

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100;

    const record = rateLimitStore.get(clientIP);

    if (!record || now > record.resetAt) {
        rateLimitStore.set(clientIP, { count: 1, resetAt: now + windowMs });
        return next();
    }

    if (record.count >= maxRequests) {
        return new Response(JSON.stringify({
            error: 'Too Many Requests',
            retryAfter: Math.ceil((record.resetAt - now) / 1000),
        }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString(),
            },
        });
    }

    record.count++;
    return next();
});

// Cleanup old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Cleanup every minute

export const onRequest = sequence(
    authMiddleware,
    protectedRoutesMiddleware,
    securityHeadersMiddleware,
    rateLimitMiddleware
);
