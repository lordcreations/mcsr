import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need authentication
  if (!request.nextUrl.pathname.startsWith('/api/users') && 
      !request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.next();
  }
  
  const authToken = request.cookies.get('auth_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  if (!authToken && !refreshToken) {
    // No tokens, let the API handle this
    return NextResponse.next();
  }
  
  // Check if auth token is valid
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/validate`, {
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });
    
    if (response.ok) {
      // Token is valid, proceed
      return NextResponse.next();
    }
    
    // Token is invalid, try refreshing if we have a refresh token
    if (refreshToken) {
      const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const response = NextResponse.next();
        
        // Set new tokens
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' as const : 'lax' as const,
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        };
        
        response.cookies.set('auth_token', data.accessToken, cookieOptions);
        if (data.refreshToken) {
          response.cookies.set('refresh_token', data.refreshToken, cookieOptions);
        }
        
        return response;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
  }
  
  // If we reach here, authentication failed
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/users/:path*', '/api/protected/:path*'],
};