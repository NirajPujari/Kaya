import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { generateToken } from "@/lib/jwt";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const db = await getDb();

    await db.collection("Users").createIndex({ email: 1 }, { unique: true });

    const existingUser = await db
      .collection("Users")
      .findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    const userId = crypto.randomUUID();
    const workoutId = "None";
    const hashedPassword = hashPassword(password);

    const newUser = {
      userId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user" as const,
      workoutId,
      createdAt: new Date(),
    };

    await db.collection("Users").insertOne(newUser);

    const userPayload = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      workoutId: newUser.workoutId,
    };

    const token = generateToken(userPayload);

    return NextResponse.json({
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration" },
      { status: 500 },
    );
  }
}
