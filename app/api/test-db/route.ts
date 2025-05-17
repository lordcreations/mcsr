import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test PostgreSQL connection
    const connectionTest = await prisma.$queryRaw<{ serverTime: string }[]>`SELECT now() as "serverTime"`;
    
    // Test table access
    const count = await prisma.userProfile.count();
    
    return NextResponse.json({
      success: true,
      message: "PostgreSQL connection successful",
      serverTime: connectionTest[0]?.serverTime,
      profileCount: count
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : String(error)  
      },
      { status: 500 }
    );
  }
}