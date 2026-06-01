/**
 * Workout Scheduling Engine
 *
 * Rules:
 * 1. User follows a rotating workout split (Day A, B, C, D, ...)
 * 2. Rest days shift all future workouts forward
 * 3. Workout order is always preserved
 * 4. No workout is ever skipped
 */

import { getOrCreateUser, updateWorkoutIndex, incrementWorkoutsCompleted } from "@/lib/db/users";
import { getAllTemplates } from "@/lib/db/workoutTemplates";
import { getLastLogForTemplate, getWeeklyStats, getLogsByDateRange } from "@/lib/db/workoutLogs";
import { addRestDay, getRestDays } from "@/lib/db/restDays";
import { ScheduledWorkout } from "@/types";
import { getTodayString } from "@/lib/utils";
import { format, parseISO } from "date-fns";

/**
 * Get the next scheduled workout for a user.
 * Considers rest days and shifts schedule accordingly.
 */
export async function getNextWorkout(userId = "default"): Promise<ScheduledWorkout | null> {
  const user = await getOrCreateUser(userId);
  const templates = await getAllTemplates(userId);
  if (templates.length === 0) return null;

  const totalWorkouts = templates.length;
  const currentIndex = user.currentWorkoutIndex % totalWorkouts;
  const template = templates[currentIndex];

  const today = getTodayString();

  // Get previous log for this template for comparison
  const previousLog = await getLastLogForTemplate(userId, template._id!.toString());

  return {
    template,
    scheduledDate: today,
    isToday: true,
    previousLog,
  };
}

/**
 * Advance to the next workout in the rotation.
 * Called after completing a workout.
 */
export async function advanceWorkout(userId = "default"): Promise<void> {
  const user = await getOrCreateUser(userId);
  const templates = await getAllTemplates(userId);
  const total = templates.length;
  const nextIndex = (user.currentWorkoutIndex + 1) % total;

  await updateWorkoutIndex(userId, nextIndex);
  await incrementWorkoutsCompleted(userId);
}

/**
 * Mark today as a rest day.
 * Future workouts are automatically shifted by the scheduler.
 */
export async function takeRestDay(userId = "default", reason?: string): Promise<void> {
  const today = getTodayString();
  await addRestDay(userId, today, reason);
}

/**
 * Get the full schedule for a date range (calendar view).
 * Returns each day with its status: completed, rest, missed, or planned.
 */
export async function getScheduleForRange(
  userId: string,
  from: string,
  to: string
): Promise<Array<{
  date: string;
  status: "completed" | "rest" | "missed" | "planned";
  workoutName?: string;
  workoutLogId?: string;
}>> {
  const [logs, restDays] = await Promise.all([
    getLogsByDateRange(userId, from, to),
    getRestDays(userId, from, to),
  ]);

  const today = getTodayString();
  const results = [];
  let current = from;

  while (current <= to) {
    const log = logs.find((l) => l.scheduledDate === current);
    const rest = restDays.find((r) => r.date === current);

    let status: "completed" | "rest" | "missed" | "planned";
    let workoutName: string | undefined;
    let workoutLogId: string | undefined;

    if (rest) {
      status = "rest";
    } else if (log) {
      status = "completed";
      workoutName = log.workoutName;
      workoutLogId = log._id?.toString();
    } else if (current < today) {
      status = "missed";
    } else {
      status = "planned";
    }

    results.push({ date: current, status, workoutName, workoutLogId });
    
    // Advance current date
    const next = parseISO(current);
    next.setDate(next.getDate() + 1);
    current = format(next, "yyyy-MM-dd");
  }

  return results;
}

/**
 * Calculate weekly completion percentage.
 */
export async function getWeeklyCompletion(userId: string): Promise<number> {
  const stats = await getWeeklyStats(userId);
  // Based on 5-day training week (Mon-Fri)
  const targetDays = 5;
  return Math.min(100, Math.round((stats.completed / targetDays) * 100));
}
