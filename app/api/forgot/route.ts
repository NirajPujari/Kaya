import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    // In a production application, you would generate a unique token, save it to DB,
    // and email a reset link to the user. For development, we log it and return success.
    console.log(`Password reset requested for email: ${normalizedEmail}`);

    return NextResponse.json({
      message: "Reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error during password reset" },
      { status: 500 }
    );
  }
}
