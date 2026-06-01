import { getDb } from "@/lib/mongodb";
import { Exercise, MuscleGroup, Equipment } from "@/types";
import { ObjectId } from "mongodb";

export async function getAllExercises(filters?: {
  muscle?: MuscleGroup;
  equipment?: Equipment;
  search?: string;
}): Promise<Exercise[]> {
  const db = await getDb();
  const query: Record<string, unknown> = {};
  if (filters?.muscle) {
    query.$or = [
      { primaryMuscles: filters.muscle },
      { secondaryMuscles: filters.muscle },
    ];
  }
  if (filters?.equipment) {
    query.equipment = filters.equipment;
  }
  if (filters?.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }
  return db
    .collection<Exercise>("exerciseLibrary")
    .find(query)
    .sort({ name: 1 })
    .toArray();
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const db = await getDb();
  // Try ObjectId first, then exerciseId slug
  try {
    const byOid = await db
      .collection<Exercise>("exerciseLibrary")
      .findOne({ _id: new ObjectId(id) });
    if (byOid) return byOid;
  } catch {}
  return db
    .collection<Exercise>("exerciseLibrary")
    .findOne({ exerciseId: id });
}

export async function getExercisesByIds(ids: string[]): Promise<Exercise[]> {
  const db = await getDb();
  return db
    .collection<Exercise>("exerciseLibrary")
    .find({ exerciseId: { $in: ids } })
    .toArray();
}

export async function createExercise(exercise: Omit<Exercise, "_id">): Promise<Exercise> {
  const db = await getDb();
  const result = await db
    .collection<Exercise>("exerciseLibrary")
    .insertOne({ ...exercise, createdAt: new Date() });
  return { ...exercise, _id: result.insertedId };
}

export async function upsertExercise(exercise: Omit<Exercise, "_id">): Promise<void> {
  const db = await getDb();
  await db.collection<Exercise>("exerciseLibrary").updateOne(
    { exerciseId: exercise.exerciseId },
    { $set: exercise },
    { upsert: true }
  );
}
