import { getDb } from "@/lib/mongodb";
import { UserSettings } from "@/types";

const defaultSettings: Omit<UserSettings, "_id"> = {
  userId: "default",
  weightUnit: "kg",
  defaultRestSeconds: 90,
  progressionModel: "strength",
  theme: "dark",
  updatedAt: new Date(),
};

export async function getSettings(userId = "default"): Promise<UserSettings> {
  const db = await getDb();
  const settings = await db
    .collection<UserSettings>("settings")
    .findOne({ userId });
  if (!settings) {
    await db.collection<UserSettings>("settings").insertOne({ ...defaultSettings, userId });
    return { ...defaultSettings, userId };
  }
  return settings;
}

export async function updateSettings(userId: string, data: Partial<UserSettings>): Promise<void> {
  const db = await getDb();
  await db.collection<UserSettings>("settings").updateOne(
    { userId },
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}
