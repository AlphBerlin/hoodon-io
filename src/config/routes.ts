// config/routes.ts
export const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/signup',
    '/api/auth/getSession',
    '/test/.*',
    '/tools/.*',
    '^/assets?/.*',
    '^/compliance?/.*',
    '/waitlist/*',
    '^/api/waitlist',
    '/test',
    '/about',
    '/contact',
    '/terms-and-conditions',
    '/privacy',
];

export const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/watch/[id]',
    '/host'
];
