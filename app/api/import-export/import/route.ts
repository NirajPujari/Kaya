import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, mode = "templates" } = body;

    if (!data) {
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 });
    }

    const db = await getDb();
    const results: Record<string, number> = {};

    if (mode === "full" && data.workoutLogs) {
      // Full restore — import all collections
      for (const collection of ["workoutTemplates", "workoutLogs", "exerciseLogs", "personalRecords", "restDays"] as const) {
        if (data[collection] && Array.isArray(data[collection])) {
          const items = data[collection].map((item: Record<string, unknown>) => {
            const { _id, ...rest } = item;
            return rest;
          });
          if (items.length > 0) {
            await db.collection(collection).insertMany(items);
            results[collection] = items.length;
          }
        }
      }
    } else if (data.workoutTemplates) {
      // Import workout templates only
      const templates = data.workoutTemplates.map((t: Record<string, unknown>) => {
        const { _id, ...rest } = t;
        return { ...rest, createdAt: new Date(), updatedAt: new Date() };
      });
      if (templates.length > 0) {
        await db.collection("workoutTemplates").insertMany(templates);
        results.workoutTemplates = templates.length;
      }
    } else if (Array.isArray(data)) {
      // Simple array of templates
      const templates = data.map((t: Record<string, unknown>) => {
        const { _id, ...rest } = t;
        return { ...rest, createdAt: new Date(), updatedAt: new Date() };
      });
      if (templates.length > 0) {
        await db.collection("workoutTemplates").insertMany(templates);
        results.workoutTemplates = templates.length;
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
