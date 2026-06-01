import { NextRequest, NextResponse } from "next/server";
import { getExerciseById } from "@/lib/db/exerciseLibrary";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exercise = await getExerciseById(id);
    if (!exercise) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: exercise });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
