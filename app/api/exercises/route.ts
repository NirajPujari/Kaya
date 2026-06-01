import { NextRequest, NextResponse } from "next/server";
import { getAllExercises } from "@/lib/db/exerciseLibrary";
import { MuscleGroup, Equipment } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const muscle = searchParams.get("muscle") as MuscleGroup | null;
    const equipment = searchParams.get("equipment") as Equipment | null;
    const search = searchParams.get("search") || undefined;

    const exercises = await getAllExercises({
      muscle: muscle ?? undefined,
      equipment: equipment ?? undefined,
      search,
    });
    return NextResponse.json({ success: true, data: exercises });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
