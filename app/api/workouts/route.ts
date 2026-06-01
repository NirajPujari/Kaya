import { NextRequest, NextResponse } from "next/server";
import { getAllTemplates, createTemplate } from "@/lib/db/workoutTemplates";
import { WorkoutTemplateSchema } from "@/lib/validations/workout";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "default";
    const templates = await getAllTemplates(userId);
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = WorkoutTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues }, { status: 400 });
    }
    const template = await createTemplate({
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
