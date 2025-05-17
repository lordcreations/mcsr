import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Get query parameters
    const country = url.searchParams.get("country") || "";
    const state = url.searchParams.get("state") || "";
    
    // Fetch from MCSR API
    let mcsrUrl = "https://mcsrranked.com/api/leaderboard";
    
    // Add country filter if specified (only for BR right now)
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
    
    // Extract player UUIDs from the response
    const playerUuids = mcsrData.data.items.map((player: any) => player.uuid);
    
    return await withPrisma(async (prisma) => {
      // Get only the players who have set a state in our DB
      const playerProfiles = await prisma.userProfile.findMany({
        where: {
          uuid: { in: playerUuids }
        },
        select: {
          uuid: true,
          country: true
        }
      });
      
      // Create a lookup map for quick access
      const stateByUuid = playerProfiles.reduce((acc, profile) => {
        acc[profile.uuid] = profile.country;
        return acc;
      }, {} as Record<string, string>);
      
      // Enhance MCSR data with our state data
      const enhancedItems = mcsrData.data.items.map((player: any) => {
        // IMPORTANT: Only add state if player exists in our DB with a state
        if (stateByUuid[player.uuid]) {
          return {
            ...player,
            state: stateByUuid[player.uuid]
          };
        }
        // Otherwise, just return the player without state
        return player;
      });
      
      // Filter by state if requested
      let filteredItems = enhancedItems;
      if (state && state !== "unknown") {
        filteredItems = enhancedItems.filter((player: { state: string; }) => player.state === state);
      }
      
      // Return the enhanced data
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