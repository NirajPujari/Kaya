import { getDb } from "@/lib/mongodb";
import { WorkoutLog } from "@/types";
import { ObjectId } from "mongodb";

export async function createWorkoutLog(log: Omit<WorkoutLog, "_id">): Promise<WorkoutLog> {
  const db = await getDb();
  const result = await db
    .collection<WorkoutLog>("workoutLogs")
    .insertOne({ ...log, startedAt: new Date() });
  return { ...log, _id: result.insertedId };
}

export async function getWorkoutLogById(id: string): Promise<WorkoutLog | null> {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .findOne({ _id: new ObjectId(id) });
}

export async function getRecentLogs(userId: string, limit = 10): Promise<WorkoutLog[]> {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .find({ userId, status: "completed" })
    .sort({ completedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getLogsByDateRange(
  userId: string,
  from: string,
  to: string
): Promise<WorkoutLog[]> {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .find({
      userId,
      scheduledDate: { $gte: from, $lte: to },
      status: "completed",
    })
    .sort({ scheduledDate: 1 })
    .toArray();
}

export async function getLastLogForTemplate(
  userId: string,
  workoutTemplateId: string
): Promise<WorkoutLog | null> {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .findOne(
      { userId, workoutTemplateId, status: "completed" },
      { sort: { completedAt: -1 } }
    );
}

export async function updateWorkoutLog(id: string, data: Partial<WorkoutLog>) {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function getAllLogs(userId: string): Promise<WorkoutLog[]> {
  const db = await getDb();
  return db
    .collection<WorkoutLog>("workoutLogs")
    .find({ userId })
    .sort({ scheduledDate: -1 })
    .toArray();
}

export async function getWeeklyStats(userId: string): Promise<{
  completed: number;
  total: number;
  volume: number;
}> {
  const db = await getDb();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  const logs = await db
    .collection<WorkoutLog>("workoutLogs")
    .find({
      userId,
      scheduledDate: { $gte: weekStartStr, $lte: todayStr },
      status: "completed",
    })
    .toArray();

  return {
    completed: logs.length,
    total: 7,
    volume: logs.reduce((sum, l) => sum + l.totalVolume, 0),
  };
}
