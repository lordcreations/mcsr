import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const uuids = url.searchParams.getAll("uuids");

    if (!uuids || uuids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No UUIDs provided",
        },
        { status: 400 }
      );
    }

    return await withPrisma(async (prisma) => {
      const existingProfiles = await prisma.userProfile.findMany({
        where: {
          uuid: { in: uuids },
        },
        select: {
          uuid: true,
          country: true,
        },
      });

      return NextResponse.json({
        success: true,
        profiles: existingProfiles, 
      });
    });
  } catch (error) {
    console.error("Error checking profiles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check profiles",
      },
      { status: 500 }
    );
  }
}
