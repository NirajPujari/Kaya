import { getDb } from "@/lib/mongodb";
import { PersonalRecord } from "@/types";
import { ObjectId } from "mongodb";

export async function checkAndUpdatePR(
  userId: string,
  exerciseId: string,
  exerciseName: string,
  weight: number,
  reps: number,
  estimatedOneRM: number,
  workoutLogId: string
): Promise<{ isNewPR: boolean; record: PersonalRecord }> {
  const db = await getDb();
  const col = db.collection<PersonalRecord>("personalRecords");
  
  const existing = await col.findOne(
    { userId, exerciseId },
    { sort: { estimatedOneRM: -1 } }
  );

  const isNewPR = !existing || estimatedOneRM > existing.estimatedOneRM;

  const record: PersonalRecord = {
    userId,
    exerciseId,
    exerciseName,
    weight,
    reps,
    estimatedOneRM,
    achievedAt: new Date(),
    workoutLogId,
  };

  if (isNewPR) {
    await col.insertOne(record);
  }

  return { isNewPR, record: isNewPR ? record : existing! };
}

export async function getAllPRs(userId: string): Promise<PersonalRecord[]> {
  const db = await getDb();
  return db
    .collection<PersonalRecord>("personalRecords")
    .aggregate([
      { $match: { userId } },
      { $sort: { achievedAt: -1 } },
      {
        $group: {
          _id: "$exerciseId",
          record: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$record" } },
      { $sort: { estimatedOneRM: -1 } },
    ])
    .toArray() as Promise<PersonalRecord[]>;
}

export async function getPRForExercise(
  userId: string,
  exerciseId: string
): Promise<PersonalRecord | null> {
  const db = await getDb();
  return db
    .collection<PersonalRecord>("personalRecords")
    .findOne({ userId, exerciseId }, { sort: { estimatedOneRM: -1 } });
}

export async function getPRHistory(
  userId: string,
  exerciseId: string,
  limit = 20
): Promise<PersonalRecord[]> {
  const db = await getDb();
  return db
    .collection<PersonalRecord>("personalRecords")
    .find({ userId, exerciseId })
    .sort({ achievedAt: -1 })
    .limit(limit)
    .toArray();
}
