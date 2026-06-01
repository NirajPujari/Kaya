import { getDb } from "@/lib/mongodb";
import { WorkoutTemplate } from "@/types";
import { ObjectId } from "mongodb";

export async function getAllTemplates(userId = "default"): Promise<WorkoutTemplate[]> {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .find({ userId })
    .sort({ dayIndex: 1 })
    .toArray();
}

export async function getTemplateById(id: string): Promise<WorkoutTemplate | null> {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .findOne({ _id: new ObjectId(id) });
}

export async function getTemplateByIndex(userId: string, dayIndex: number): Promise<WorkoutTemplate | null> {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .findOne({ userId, dayIndex });
}

export async function createTemplate(template: Omit<WorkoutTemplate, "_id">): Promise<WorkoutTemplate> {
  const db = await getDb();
  const result = await db
    .collection<WorkoutTemplate>("workoutTemplates")
    .insertOne({ ...template, createdAt: new Date(), updatedAt: new Date() });
  return { ...template, _id: result.insertedId };
}

export async function updateTemplate(id: string, data: Partial<WorkoutTemplate>) {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } });
}

export async function deleteTemplate(id: string) {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .deleteOne({ _id: new ObjectId(id) });
}

export async function countTemplates(userId = "default"): Promise<number> {
  const db = await getDb();
  return db
    .collection<WorkoutTemplate>("workoutTemplates")
    .countDocuments({ userId });
}
