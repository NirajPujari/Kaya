import { NextRequest, NextResponse } from "next/server";
import { getWorkoutLogById, updateWorkoutLog } from "@/lib/db/workoutLogs";
import { getExerciseLogsByWorkout } from "@/lib/db/exerciseLogs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [log, exerciseLogs] = await Promise.all([
      getWorkoutLogById(id),
      getExerciseLogsByWorkout(id),
    ]);
    if (!log) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: { log, exerciseLogs } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateWorkoutLog(id, body);
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
