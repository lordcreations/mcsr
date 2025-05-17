// app/api/player-head/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");

    if (!uuid) {
      return new Response("UUID is required", { status: 400 });
    }

    // Use the new player head URL
    const playerHeadUrl = `https://starlightskins.lunareclipse.studio/render/head/${uuid}/full`;

    const headResponse = await fetch(playerHeadUrl, {
      headers: {
        "User-Agent": "MCSR-Brazil-App/1.0",
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!headResponse.ok) {
      throw new Error(`Failed to fetch player head: ${headResponse.statusText}`);
    }

    const imageData = await headResponse.arrayBuffer();

    return new Response(imageData, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching player head:", error);

    // Return a default head if there's an error
    return NextResponse.redirect(new URL("/default-head.png", request.url));
  }
}
