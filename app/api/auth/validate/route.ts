import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = 'edge';

export const GET = async (request: NextRequest) => {
  try {
    
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    console.log("Auth token:", authToken);
    
    console.log("Current URL:", request.url);
    console.log("Auth token present:", !!authToken);
    console.log("Auth token length:", authToken?.length);
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    
    const profileResponse = await fetch("https://vex.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        
      },
      cache: 'no-store' 
    });
    
    console.log("Minecraft API status:", profileResponse.status);
    
    if (!profileResponse.ok) {
      
      const errorText = await profileResponse.text();
      console.error("Minecraft API error:", {
        status: profileResponse.status,
        text: errorText
      });
      
      
      cookieStore.delete("auth_token");
      cookieStore.delete("refresh_token");
      
      return NextResponse.json(
        { error: "Invalid or expired token", details: errorText },
        { status: 401 }
      );
    }
    
    const profileData = await profileResponse.json();
    console.log("Profile data received:", !!profileData);
    
    const user = {
      id: profileData.id,
      displayName: profileData.name,
      uuid: profileData.id,
    };
    
    
    const headers = new Headers();
    headers.set('Cache-Control', 'private, max-age=30');
    
    return NextResponse.json(user, { headers });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { 
        error: "Authentication validation failed", 
        details: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
      },
      { status: 500 }
    );
  }
};