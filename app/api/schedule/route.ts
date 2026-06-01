import { NextRequest, NextResponse } from "next/server";
import { getNextWorkout, getWeeklyCompletion } from "@/lib/engine/scheduler";
import { getRecentLogs, getWeeklyStats } from "@/lib/db/workoutLogs";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";

    const [scheduled, recentLogs, weeklyStats, weeklyCompletion] = await Promise.all([
      getNextWorkout(userId),
      getRecentLogs(userId, 5),
      getWeeklyStats(userId),
      getWeeklyCompletion(userId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        scheduled,
        recentLogs,
        weeklyStats,
        weeklyCompletion,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
