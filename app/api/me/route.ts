import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.slice(7);
    const userPayload = verifyToken(token);

    if (!userPayload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        userId: userPayload.userId,
        name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role,
        workoutId: userPayload.workoutId,
      },
    });
  } catch (error) {
    console.error("Fetch me error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
