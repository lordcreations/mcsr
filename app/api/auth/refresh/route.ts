import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 400 });
    }
    
    // Microsoft OAuth refresh token flow
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    
    const tokenResponse = await fetch(
      "https://login.live.com/oauth20_token.srf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId || "",
          client_secret: clientSecret || "",
          refresh_token: refreshToken || "",
          grant_type: "refresh_token",
        }),
      }
    );
    
    if (!tokenResponse.ok) {
      console.error("Token refresh failed:", await tokenResponse.text());
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 });
    }
    
    const tokenData = await tokenResponse.json();
    
    // Continue with Xbox authentication flow if needed
    // ...
    
    return NextResponse.json({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh authentication" },
      { status: 500 }
    );
  }
}