import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withPrisma } from "@/lib/prisma";

// GET a user profile
export async function GET(request: NextRequest) {
  try {
    // Get the auth token to verify the user is logged in
    const authToken = (await cookies()).get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the user UUID from the query params
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    
    if (!uuid) {
      return NextResponse.json(
        { error: "UUID is required" },
        { status: 400 }
      );
    }
    
    // Use withPrisma to handle database connection lifecycle
    return await withPrisma(async (prisma) => {
      // Get the user profile from the database
      const userProfile = await prisma.userProfile.findUnique({
        where: { uuid }
      });
      
      if (!userProfile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(userProfile);
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// Save/update a user profile
export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const authToken = (await cookies()).get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const profileData = await request.json();
    
    // Validate minimum required fields
    if (!profileData.uuid || !profileData.nickname) {
      return NextResponse.json(
        { error: "UUID and nickname are required" },
        { status: 400 }
      );
    }
    
    // Validate the user can only update their own profile
    const userUuid = await getUserUuidFromToken(authToken);
    
    if (userUuid !== profileData.uuid) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }
    
    // Use withPrisma to handle database connection lifecycle
    return await withPrisma(async (prisma) => {
      // Update or create the user profile in the database
      const userProfile = await prisma.userProfile.upsert({
        where: { uuid: profileData.uuid },
        update: {
          nickname: profileData.nickname,
          country: profileData.country,
        },
        create: {
          uuid: profileData.uuid,
          nickname: profileData.nickname,
          country: profileData.country || "unknown",
        },
      });
      
      return NextResponse.json({ 
        success: true,
        profile: userProfile
      });
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

// Helper function to get user UUID from token
async function getUserUuidFromToken(token: string): Promise<string> {
  try {
    // Validate with Minecraft API
    const profileResponse = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!profileResponse.ok) {
      throw new Error("Invalid token");
    }
    
    const profileData = await profileResponse.json();
    return profileData.id;
  } catch (error) {
    console.error("Error validating token:", error);
    throw error;
  }
}