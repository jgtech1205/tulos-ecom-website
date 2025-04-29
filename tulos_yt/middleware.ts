// middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default authMiddleware({
  publicRoutes: ['/', '/api/webhook(.*)', '/privacy', '/terms', '/product(.*)', '/success'],
  ignoredRoutes: ['/studio(.*)', '/api/webhook(.*)']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};