import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check for auth token
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Add authentication state to response headers
  // This allows components to know auth status without additional API calls
  const response = NextResponse.next();
  
  if (authToken) {
    response.headers.set('x-is-authenticated', 'true');
  } else {
    response.headers.set('x-is-authenticated', 'false');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|favicon.ico).*)',
  ],
};