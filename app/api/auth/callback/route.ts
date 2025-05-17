// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle GET requests (Microsoft redirects here with code as query param)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    
    if (!code) {
      // If no code is present, redirect to home page
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Process authentication with the code
    const authResult = await processAuthentication(code);
    
    if (authResult.success) {
      // Redirect to home page with success
      return NextResponse.redirect(new URL("/?login=success", req.url));
    } else {
      // Redirect with error
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(authResult.error || "Unknown error")}`, req.url)
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(
      new URL("/?error=authentication_failed", req.url)
    );
  }
}

// Keep your existing POST handler for client-side code exchange
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }
    
    const authResult = await processAuthentication(code);
    
    if (authResult.success) {
      return NextResponse.json({ success: true, user: authResult.user });
    } else {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 500 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// Extract the common authentication logic to a shared function
async function processAuthentication(code: string) {
  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://login.live.com/oauth20_token.srf", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || "",
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      return { success: false, error: "Failed to exchange code for token", status: 500 };
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Get Xbox Live token
    const xblResponse = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${access_token}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      }),
    });

    const xblData = await xblResponse.json();
    const xblToken = xblData.Token;
    const userHash = xblData.DisplayClaims.xui[0].uhs;

    // Get XSTS token
    const xstsResponse = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xblToken],
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
      }),
    });

    const xstsData = await xstsResponse.json();
    const xstsToken = xstsData.Token;

    // Authenticate with Minecraft
    const mcResponse = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
      }),
    });
    
    const mcData = await mcResponse.json();
    const mcAccessToken = mcData.access_token;

    // Get Minecraft profile
    const profileResponse = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${mcAccessToken}`,
      },
    });

    // If the user doesn't own Minecraft, this will fail
    if (!profileResponse.ok) {
      return {
        success: false, 
        error: "You don't own Minecraft or can't access your profile",
        status: 403
      };
    }

    const profileData = await profileResponse.json();
    
    // Store token and user data
    const user = {
      id: profileData.id,
      displayName: profileData.name,
      uuid: profileData.id,
      xuid: userHash,
    };

    // Create a secure token combining the minecraft token and user data
    const authToken = mcAccessToken;
    
    // Set cookie for authentication
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: authToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Also store refresh token securely
    cookieStore.set({
      name: "refresh_token",
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return { success: true, user };
  } catch (error) {
    console.error("Authentication error in processAuthentication:", error);
    return { success: false, error: "Authentication processing failed" };
  }
}
