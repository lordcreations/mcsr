import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the authentication cookies by setting them to expire in the past
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", { expires: new Date(0), path: "/" });
  cookieStore.set("refresh_token", "", { expires: new Date(0), path: "/" });
  
  return NextResponse.json({ success: true });
}