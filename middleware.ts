import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Keep only API key validation for local API if needed
  if (request.nextUrl.pathname.startsWith('/api/local')) {
    if (request.method === 'POST' || request.method === 'DELETE' || request.method === 'PUT' || request.method === 'PATCH') {
      const apiKey = request.headers.get('x-api-key');
      
      if (!apiKey || apiKey !== process.env.API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }
  
  // Remove all auth token validation
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/users/:path*', 
    '/api/protected/:path*',
    '/api/local/:path*'
  ],
};