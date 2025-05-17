import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    const host = req.headers.get("host") || "localhost:3000";
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? `https://${host}/api/auth/callback`
        : "http://localhost:3000/api/auth/callback";

    const referer = req.headers.get("referer");

    const authResult = await processAuthentication(code, redirectUri);
    if (!authResult.success) {
      return NextResponse.redirect(
        new URL(`/login?error=${authResult.error}`, req.url)
      );
    }

    const { user, mcAccessToken, refreshToken } = authResult;

    const response = NextResponse.redirect(referer || new URL("/", req.url));
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    } as const;

    response.cookies.set("auth_token", mcAccessToken, cookieOptions);
    response.cookies.set("refresh_token", refreshToken, cookieOptions);

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? `https://${host}/api/auth/callback`
        : "http://localhost:3000/api/auth/callback";

    const authResult = await processAuthentication(code, redirectUri);

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

async function processAuthentication(code: string, redirectUri: string) {
  try {
    const minecraftApi = axios.create({
      baseURL: "https://vex.minecraftservices.com",
    });
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing required environment variables.");
      return { success: false, error: "missing_env", status: 500 };
    }

    const tokenResponse = await axios.post(
      "https://login.live.com/oauth20_token.srf",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    console.log("OAuth Access Token obtained");

    const xblResponse = await axios.post(
      "https://user.auth.xboxlive.com/user/authenticate",
      {
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${access_token}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const xblData = xblResponse.data;
    const xblToken = xblData.Token;
    const userHash = xblData.DisplayClaims.xui[0].uhs;

    const xstsResponse = await axios.post(
      "https://xsts.auth.xboxlive.com/xsts/authorize",
      {
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xblToken],
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const xstsToken = xstsResponse.data.Token;

    const mcResponse = await minecraftApi.post(
      "/authentication/login_with_xbox",
      {
        identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const mcAccessToken = mcResponse.data.access_token;

    const profileResponse = await minecraftApi.get("/minecraft/profile", {
      headers: {
        Authorization: `Bearer ${mcAccessToken}`,
      },
    });

    const profileData = profileResponse.data;

    const user = {
      id: profileData.id,
      displayName: profileData.name,
      uuid: profileData.id,
      xuid: userHash,
    };

    return {
      success: true,
      user,
      mcAccessToken,
      refreshToken: refresh_token,
    };
  } catch (error: any) {
    console.error(
      "Authentication error in processAuthentication:",
      error?.response?.data || error
    );
    return {
      success: false,
      error: "auth_processing_failed",
      status: 500,
    };
  }
}
