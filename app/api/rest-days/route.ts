import { NextRequest, NextResponse } from "next/server";
import { addRestDay, getRestDays } from "@/lib/db/restDays";
import { RestDaySchema } from "@/lib/validations/workout";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const from = request.nextUrl.searchParams.get("from") || undefined;
    const to = request.nextUrl.searchParams.get("to") || undefined;
    const restDays = await getRestDays(userId, from, to);
    return NextResponse.json({ success: true, data: restDays });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RestDaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues }, { status: 400 });
    }
    const restDay = await addRestDay(parsed.data.userId, parsed.data.date, parsed.data.reason);
    return NextResponse.json({ success: true, data: restDay }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
