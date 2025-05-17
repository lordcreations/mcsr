import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    const country = url.searchParams.get("country") || "";
    const state = url.searchParams.get("state") || "";
    
    let mcsrUrl = "https://mcsrranked.com/api/leaderboard";
    
    if (country === "br") {
      mcsrUrl += "?country=br";
    }
    
    const mcsrResponse = await fetch(mcsrUrl);
    
    if (!mcsrResponse.ok) {
      throw new Error(`MCSR API error: ${mcsrResponse.statusText}`);
    }
    
    const mcsrData = await mcsrResponse.json();
    
    if (!mcsrData.success) {
      return NextResponse.json(mcsrData, { status: 400 });
    }
    
    const playerUuids = mcsrData.data.items.map((player: any) => player.uuid);
    
    return await withPrisma(async (prisma) => {
      const playerProfiles = await prisma.userProfile.findMany({
        where: {
          uuid: { in: playerUuids }
        },
        select: {
          uuid: true,
          country: true
        }
      });
      
      const stateByUuid = playerProfiles.reduce((acc, profile) => {
        acc[profile.uuid] = profile.country;
        return acc;
      }, {} as Record<string, string>);
      
      const enhancedItems = mcsrData.data.items.map((player: any) => {
        if (stateByUuid[player.uuid]) {
          return {
            ...player,
            state: stateByUuid[player.uuid]
          };
        }
        return player;
      });
      
      let filteredItems = enhancedItems;
      if (state && state !== "unknown") {
        filteredItems = enhancedItems.filter((player: { state: string; }) => player.state === state);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          ...mcsrData.data,
          items: filteredItems,
          totalFiltered: filteredItems.length
        }
      });
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard data"
      },
      { status: 500 }
    );
  }
}