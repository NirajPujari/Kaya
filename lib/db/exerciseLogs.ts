import { getDb } from "@/lib/mongodb";
import { ExerciseLog } from "@/types";
import { ObjectId } from "mongodb";

export async function createExerciseLog(log: Omit<ExerciseLog, "_id">): Promise<ExerciseLog> {
  const db = await getDb();
  const result = await db
    .collection<ExerciseLog>("exerciseLogs")
    .insertOne({ ...log, loggedAt: new Date() });
  return { ...log, _id: result.insertedId };
}

export async function getExerciseLogsByWorkout(workoutLogId: string): Promise<ExerciseLog[]> {
  const db = await getDb();
  return db
    .collection<ExerciseLog>("exerciseLogs")
    .find({ workoutLogId })
    .sort({ order: 1 })
    .toArray();
}

export async function getRecentLogsForExercise(
  userId: string,
  exerciseId: string,
  limit = 5
): Promise<ExerciseLog[]> {
  const db = await getDb();
  return db
    .collection<ExerciseLog>("exerciseLogs")
    .find({ userId, exerciseId })
    .sort({ loggedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getVolumeByMuscle(userId: string, days = 30): Promise<Array<{
  exerciseId: string;
  exerciseName: string;
  totalVolume: number;
  sessions: number;
}>> {
  const db = await getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return db
    .collection<ExerciseLog>("exerciseLogs")
    .aggregate([
      { $match: { userId, loggedAt: { $gte: since } } },
      {
        $group: {
          _id: { exerciseId: "$exerciseId", exerciseName: "$exerciseName" },
          totalVolume: { $sum: "$totalVolume" },
          sessions: { $sum: 1 },
        },
      },
      {
        $project: {
          exerciseId: "$_id.exerciseId",
          exerciseName: "$_id.exerciseName",
          totalVolume: 1,
          sessions: 1,
          _id: 0,
        },
      },
      { $sort: { totalVolume: -1 } },
    ])
    .toArray() as Promise<Array<{ exerciseId: string; exerciseName: string; totalVolume: number; sessions: number }>>;
}

export async function getStrengthProgressionForExercise(
  userId: string,
  exerciseId: string
): Promise<Array<{ date: string; maxWeight: number; maxReps: number; volume: number }>> {
  const db = await getDb();
  return db
    .collection<ExerciseLog>("exerciseLogs")
    .aggregate([
      { $match: { userId, exerciseId } },
      { $unwind: "$sets" },
      { $match: { "sets.completed": true, "sets.type": { $ne: "warmup" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$loggedAt" } },
          maxWeight: { $max: "$sets.weight" },
          maxReps: { $max: "$sets.reps" },
          volume: { $sum: { $multiply: ["$sets.weight", "$sets.reps"] } },
        },
      },
      {
        $project: {
          date: "$_id",
          maxWeight: 1,
          maxReps: 1,
          volume: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ])
    .toArray() as Promise<Array<{ date: string; maxWeight: number; maxReps: number; volume: number }>>;
}

export async function getAllLogsForExport(userId: string): Promise<ExerciseLog[]> {
  const db = await getDb();
  return db
    .collection<ExerciseLog>("exerciseLogs")
    .find({ userId })
    .sort({ loggedAt: -1 })
    .toArray();
}
