import { NextRequest, NextResponse } from "next/server";
import { getVolumeByMuscle, getStrengthProgressionForExercise, getAllLogsForExport } from "@/lib/db/exerciseLogs";
import { getAllLogs, getLogsByDateRange } from "@/lib/db/workoutLogs";
import { getAllPRs } from "@/lib/db/personalRecords";
import { getRestDays } from "@/lib/db/restDays";
import { getAllExercises } from "@/lib/db/exerciseLibrary";
import { calculate1RM } from "@/lib/engine/progression";
import { getScheduleForRange } from "@/lib/engine/scheduler";
import { format, subDays } from "date-fns";
import { AnalyticsData, VolumeByMuscle, StrengthProgression } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const days = parseInt(request.nextUrl.searchParams.get("days") || "30");

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const from = format(startDate, "yyyy-MM-dd");
    const to = format(endDate, "yyyy-MM-dd");

    // Parallel data fetching
    const [
      exerciseVolumeData,
      allLogs,
      prs,
      exercises,
      consistencyData,
    ] = await Promise.all([
      getVolumeByMuscle(userId, days),
      getLogsByDateRange(userId, from, to),
      getAllPRs(userId),
      getAllExercises(),
      getScheduleForRange(userId, from, to),
    ]);

    // Build volume by muscle group
    const muscleVolumeMap = new Map<string, { volume: number; sets: number }>();
    for (const exVol of exerciseVolumeData) {
      const exercise = exercises.find((e) => e.exerciseId === exVol.exerciseId);
      if (!exercise) continue;
      const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
      for (const muscle of muscles) {
        const current = muscleVolumeMap.get(muscle) || { volume: 0, sets: 0 };
        const weight = exercise.primaryMuscles.includes(muscle) ? 1 : 0.5;
        muscleVolumeMap.set(muscle, {
          volume: current.volume + exVol.totalVolume * weight,
          sets: current.sets + exVol.sessions,
        });
      }
    }

    const volumeByMuscle: VolumeByMuscle[] = Array.from(muscleVolumeMap.entries())
      .map(([muscle, data]) => ({ muscle, volume: Math.round(data.volume), sets: data.sets }))
      .sort((a, b) => b.volume - a.volume);

    const volumeByExercise = exerciseVolumeData.map((e) => ({
      exerciseName: e.exerciseName,
      volume: e.totalVolume,
      sessions: e.sessions,
    }));

    // Strength progression for top exercises
    const topExercises = exerciseVolumeData.slice(0, 8);
    const strengthProgressions: StrengthProgression[] = await Promise.all(
      topExercises.map(async (ex) => {
        const data = await getStrengthProgressionForExercise(userId, ex.exerciseId);
        const points = data.map((d) => ({
          date: d.date,
          weight: d.maxWeight,
          reps: d.maxReps,
          estimatedOneRM: calculate1RM(d.maxWeight, d.maxReps),
        }));
        const startMax = points[0]?.estimatedOneRM ?? 0;
        const currentMax = points[points.length - 1]?.estimatedOneRM ?? 0;
        return {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          data: points,
          currentMax,
          startMax,
          improvement: startMax > 0 ? ((currentMax - startMax) / startMax) * 100 : 0,
        };
      })
    );

    // Streak calculation
    const completedDates = allLogs.map((l) => l.scheduledDate).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const prev = new Date(completedDates[i - 1]);
      const curr = new Date(completedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Check if streak is current
    const lastLog = allLogs[allLogs.length - 1];
    if (lastLog) {
      const daysSinceLastLog = Math.floor(
        (Date.now() - new Date(lastLog.scheduledDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      currentStreak = daysSinceLastLog <= 1 ? tempStreak : 0;
    }

    const totalVolumeLifted = allLogs.reduce((sum, l) => sum + l.totalVolume, 0);
    const avgSessionDuration =
      allLogs.length > 0
        ? allLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0) / allLogs.length
        : 0;

    const weeklyCompletionRate =
      allLogs.length > 0 ? Math.min(100, Math.round((allLogs.length / (days / 7 * 5)) * 100)) : 0;

    const analytics: AnalyticsData = {
      volumeByMuscle,
      volumeByExercise,
      strengthProgressions,
      consistencyData: consistencyData.map((d) => ({
        date: d.date,
        status: d.status,
        workoutName: d.workoutName,
      })),
      personalRecords: prs,
      weeklyCompletionRate,
      totalWorkoutsCompleted: allLogs.length,
      currentStreak,
      longestStreak,
      avgSessionDuration: Math.round(avgSessionDuration),
      totalVolumeLifted: Math.round(totalVolumeLifted),
    };

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
