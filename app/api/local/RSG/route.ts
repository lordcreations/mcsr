import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rsgPlay = await withPrisma((prisma) =>
        prisma.rsgPlays.findUnique({
          where: {
            id: id,
          },
        })
      );
      if (!rsgPlay) {
        return NextResponse.json(
          { error: "RSG-Play not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(rsgPlay);
    } else {
      const rsgPlays = await withPrisma((prisma) =>
        prisma.rsgPlays.findMany({
          orderBy: {
            createdAt: "desc",
          },
        })
      );
      return NextResponse.json(rsgPlays);
    }
  } catch (error) {
    console.error("Error fetching RSG-Plays:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nickname, time, videoUrl, ign } = await request.json();
    if (!nickname || !time || !videoUrl || !ign) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const uuidResponse = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${ign}`
    );
    if (!uuidResponse.ok) {
      return NextResponse.json(
        { error: "Invalid Minecraft nickname" },
        { status: 400 }
      );
    }
    const uuidData = await uuidResponse.json();
    const userId = uuidData.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid Minecraft nickname" },
        { status: 400 }
      );
    }

    const newRsgPlay = await withPrisma((prisma) =>
      prisma.rsgPlays.create({
        data: {
          time,
          videoUrl,
          nickname,
          userProfileId: userId,
        },
      })
    );

    return NextResponse.json(newRsgPlay);
  } catch (error) {
    console.error("Error creating RSG-Play:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const deletedRsgPlay = await withPrisma((prisma) =>
      prisma.rsgPlays.delete({
        where: {
          id: id,
        },
      })
    );

    return NextResponse.json(deletedRsgPlay);
  } catch (error) {
    console.error("Error deleting RSG-Play:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}