import { getDb } from "@/lib/mongodb";
import { RestDay } from "@/types";

export async function getRestDays(userId: string, from?: string, to?: string): Promise<RestDay[]> {
  const db = await getDb();
  const query: Record<string, unknown> = { userId };
  if (from || to) {
    query.date = {};
    if (from) (query.date as Record<string, string>).$gte = from;
    if (to) (query.date as Record<string, string>).$lte = to;
  }
  return db
    .collection<RestDay>("restDays")
    .find(query)
    .sort({ date: -1 })
    .toArray();
}

export async function isRestDay(userId: string, date: string): Promise<boolean> {
  const db = await getDb();
  const count = await db
    .collection<RestDay>("restDays")
    .countDocuments({ userId, date });
  return count > 0;
}

export async function addRestDay(userId: string, date: string, reason?: string): Promise<RestDay> {
  const db = await getDb();
  const col = db.collection<RestDay>("restDays");

  // Prevent duplicates
  const existing = await col.findOne({ userId, date });
  if (existing) return existing;

  const restDay: RestDay = {
    userId,
    date,
    reason,
    createdAt: new Date(),
  };
  await col.insertOne(restDay);
  return restDay;
}

export async function removeRestDay(userId: string, date: string): Promise<void> {
  const db = await getDb();
  await db.collection<RestDay>("restDays").deleteOne({ userId, date });
}

export async function countRestDaysBetween(
  userId: string,
  from: string,
  to: string
): Promise<number> {
  const db = await getDb();
  return db
    .collection<RestDay>("restDays")
    .countDocuments({ userId, date: { $gte: from, $lte: to } });
}
