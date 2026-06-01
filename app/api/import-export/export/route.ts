import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const db = await getDb();

    const [
      workoutTemplates,
      workoutLogs,
      exerciseLogs,
      personalRecords,
      restDays,
      settings,
    ] = await Promise.all([
      db.collection("workoutTemplates").find({ userId }).toArray(),
      db.collection("workoutLogs").find({ userId }).toArray(),
      db.collection("exerciseLogs").find({ userId }).toArray(),
      db.collection("personalRecords").find({ userId }).toArray(),
      db.collection("restDays").find({ userId }).toArray(),
      db.collection("settings").find({ userId }).toArray(),
    ]);

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      userId,
      data: {
        workoutTemplates,
        workoutLogs,
        exerciseLogs,
        personalRecords,
        restDays,
        settings,
      },
    };

    const json = JSON.stringify(exportData, null, 2);

    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="ironlog-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
