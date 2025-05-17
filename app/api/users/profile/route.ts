import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withPrisma } from "@/lib/prisma";


export async function GET(request: NextRequest) {
  try {
    
    const authToken = (await cookies()).get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    
    if (!uuid) {
      return NextResponse.json(
        { error: "UUID is required" },
        { status: 400 }
      );
    }
    
    
    return await withPrisma(async (prisma) => {
      
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

export async function POST(request: NextRequest) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const profileData = await request.json();
    
    if (!profileData.uuid || !profileData.nickname) {
      return NextResponse.json(
        { error: "UUID and nickname are required" },
        { status: 400 }
      );
    }
    
    const userUuid = await getUserUuidFromToken(authToken);
    
    if (userUuid !== profileData.uuid) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }
    
    return await withPrisma(async (prisma) => {
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

async function getUserUuidFromToken(token: string): Promise<string> {
  try {
    const profileResponse = await fetch("https://vex.minecraftservices.com/minecraft/profile", {
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