import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Add caching headers to reduce repeated validation
export const runtime = 'edge'; // Use edge runtime for better performance

export const GET = async () => {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Check token expiry without making API call if possible
    // (You'd need to store token expiry info, this is just conceptual)
    const tokenData = getTokenData(authToken);
    if (tokenData && tokenData.exp && tokenData.exp < Date.now() / 1000) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }

    // Validate with Minecraft API - implement caching when possible
    const profileResponse = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    if (!profileResponse.ok) {
      // Clear invalid tokens
      const cookieStore = await cookies();
      cookieStore.delete("auth_token");
      cookieStore.delete("refresh_token");
      
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    const profileData = await profileResponse.json();
    
    const user = {
      id: profileData.id,
      displayName: profileData.name,
      uuid: profileData.id,
    };
    
    // Set cache headers to allow some caching
    const headers = new Headers();
    headers.set('Cache-Control', 'private, max-age=30'); // Cache for 30 seconds
    
    return NextResponse.json(user, { headers });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Authentication validation failed" },
      { status: 500 }
    );
  }
};

// Helper function (conceptual)
function getTokenData(token: string): { exp?: number } | null {
  try {
    // This is just a conceptual function
    // In reality, you'd need to decode the JWT or store token metadata
    return null;
  } catch {
    return null;
  }
}