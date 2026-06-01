import { NextRequest, NextResponse } from "next/server";
import { getAllPRs } from "@/lib/db/personalRecords";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const records = await getAllPRs(userId);
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
