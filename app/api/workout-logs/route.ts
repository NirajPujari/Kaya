import { NextRequest, NextResponse } from "next/server";
import { createWorkoutLog, getRecentLogs, getAllLogs } from "@/lib/db/workoutLogs";
import { createExerciseLog } from "@/lib/db/exerciseLogs";
import { checkAndUpdatePR } from "@/lib/db/personalRecords";
import { advanceWorkout } from "@/lib/engine/scheduler";
import { calculate1RM, calculateVolume, findNewPRs } from "@/lib/engine/progression";
import { getPRForExercise } from "@/lib/db/personalRecords";
import { WorkoutLogSchema } from "@/lib/validations/workout";
import { getTodayString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const all = request.nextUrl.searchParams.get("all") === "true";
    const logs = all ? await getAllLogs(userId) : await getRecentLogs(userId, 20);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workoutData, exerciseLogs, durationMinutes } = body;

    // Validate workout log
    const parsed = WorkoutLogSchema.safeParse(workoutData);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues }, { status: 400 });
    }

    // Calculate totals
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    for (const exLog of exerciseLogs) {
      const volume = calculateVolume(exLog.sets);
      totalVolume += volume;
      totalSets += exLog.sets.filter((s: { completed: boolean }) => s.completed).length;
      totalReps += exLog.sets
        .filter((s: { completed: boolean }) => s.completed)
        .reduce((sum: number, s: { reps: number }) => sum + s.reps, 0);
      exLog.totalVolume = volume;
    }

    // Create workout log
    const workoutLog = await createWorkoutLog({
      ...parsed.data,
      scheduledDate: parsed.data.scheduledDate || getTodayString(),
      startedAt: new Date(),
      completedAt: new Date(),
      durationMinutes,
      totalVolume,
      totalSets,
      totalReps,
      exerciseCount: exerciseLogs.length,
      status: "completed",
    });

    const workoutLogId = workoutLog._id!.toString();

    // Save exercise logs and check PRs
    const newPRs = [];
    for (const exLog of exerciseLogs) {
      await createExerciseLog({
        ...exLog,
        workoutLogId,
        loggedAt: new Date(),
      });

      // Check for PRs
      const currentPR = await getPRForExercise(parsed.data.userId, exLog.exerciseId);
      const currentBest1RM = currentPR?.estimatedOneRM ?? 0;
      const prResult = findNewPRs(exLog.sets, currentBest1RM);

      if (prResult) {
        await checkAndUpdatePR(
          parsed.data.userId,
          exLog.exerciseId,
          exLog.exerciseName,
          prResult.weight,
          prResult.reps,
          prResult.estimatedOneRM,
          workoutLogId
        );
        newPRs.push({ exerciseName: exLog.exerciseName, ...prResult });
      }
    }

    // Advance to next workout in rotation
    await advanceWorkout(parsed.data.userId);

    return NextResponse.json({
      success: true,
      data: { workoutLog, newPRs },
    }, { status: 201 });
  } catch (error) {
    console.error("Workout log error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
