// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const client_id = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!;
    const client_secret = process.env.MICROSOFT_CLIENT_SECRET!;
    const redirect_uri = "http://localhost:3000/api/auth/callback";

    // STEP 1: Exchange code for access_token
    const tokenRes = await axios.post(
      "https://login.live.com/oauth20_token.srf",
      new URLSearchParams({
        client_id,
        client_secret,
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const access_token = tokenRes.data.access_token;

    // STEP 2: Xbox Live Authentication
    const xblRes = await axios.post(
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
        headers: { "Content-Type": "application/json" },
      }
    );

    const xblToken = xblRes.data.Token;
    const uhs = xblRes.data.DisplayClaims.xui[0].uhs;

    // STEP 3: XSTS Authorization
    const xstsRes = await axios.post(
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
        headers: { "Content-Type": "application/json" },
      }
    );

    const xstsToken = xstsRes.data.Token;

    // STEP 4: Minecraft Auth
    const mcRes = await axios.post(
      "https://api.minecraftservices.com/authentication/login_with_xbox",
      {
        identityToken: `XBL3.0 x=${uhs};${xstsToken}`,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const mcAccessToken = mcRes.data.access_token;

    // STEP 5: Minecraft Profile
    const profileRes = await axios.get("https://api.minecraftservices.com/minecraft/profile", {
      headers: {
        Authorization: `Bearer ${mcAccessToken}`,
      },
    });

    const { name, id } = profileRes.data;

    // Optional: set a cookie with the Minecraft UUID or session info
    const response = NextResponse.redirect("http://localhost:3000/?verified=1");
    response.cookies.set("minecraft_id", id, {
      httpOnly: true,
      secure: false, // set to true in production (with HTTPS)
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    response.cookies.set("minecraft_name", name, {
      httpOnly: false,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Callback error:", error.response?.data || error.message);
    return NextResponse.json({ error: "OAuth callback failed" }, { status: 500 });
  }
}
