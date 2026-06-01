import { getDb } from "@/lib/mongodb";
import { User } from "@/types";

export async function getOrCreateUser(userId = "default"): Promise<User> {
  const db = await getDb();
  const col = db.collection<User>("users");
  let user = await col.findOne({ userId });
  if (!user) {
    const newUser: User = {
      userId,
      name: "Athlete",
      createdAt: new Date(),
      updatedAt: new Date(),
      currentWorkoutIndex: 0,
      totalWorkoutsCompleted: 0,
    };
    await col.insertOne(newUser);
    user = await col.findOne({ userId });
  }
  return user!;
}

export async function updateWorkoutIndex(userId: string, index: number) {
  const db = await getDb();
  await db.collection<User>("users").updateOne(
    { userId },
    { $set: { currentWorkoutIndex: index, updatedAt: new Date() } }
  );
}

export async function incrementWorkoutsCompleted(userId: string) {
  const db = await getDb();
  await db.collection<User>("users").updateOne(
    { userId },
    { $inc: { totalWorkoutsCompleted: 1 }, $set: { updatedAt: new Date() } }
  );
}
