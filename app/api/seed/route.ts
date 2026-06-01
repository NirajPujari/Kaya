import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { EXERCISES, WORKOUT_TEMPLATES } from "@/data/seed";
import { getOrCreateUser } from "@/lib/db/users";

export async function POST() {
  try {
    const db = await getDb();

    // Seed exercises
    const exCol = db.collection("exerciseLibrary");
    for (const exercise of EXERCISES) {
      await exCol.updateOne(
        { exerciseId: exercise.exerciseId },
        { $set: exercise },
        { upsert: true }
      );
    }

    // Seed workout templates (only if none exist)
    const tmplCol = db.collection("workoutTemplates");
    const existing = await tmplCol.countDocuments({ userId: "default" });
    if (existing === 0) {
      await tmplCol.insertMany(WORKOUT_TEMPLATES);
    }

    // Create default user
    await getOrCreateUser("default");

    // Create indexes
    await db.collection("workoutLogs").createIndex({ userId: 1, scheduledDate: -1 });
    await db.collection("workoutLogs").createIndex({ userId: 1, status: 1 });
    await db.collection("exerciseLogs").createIndex({ userId: 1, exerciseId: 1, loggedAt: -1 });
    await db.collection("personalRecords").createIndex({ userId: 1, exerciseId: 1 });
    await db.collection("restDays").createIndex({ userId: 1, date: 1 }, { unique: true });

    return NextResponse.json({
      success: true,
      message: `Seeded ${EXERCISES.length} exercises and ${WORKOUT_TEMPLATES.length} workout templates.`,
      data: {
        exercises: EXERCISES.length,
        templates: WORKOUT_TEMPLATES.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
