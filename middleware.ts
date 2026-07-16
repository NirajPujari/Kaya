import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

type Role = "everyone" | "user" | "admin";

const routePermissions: Record<string, Role> = {
  "/api/login": "everyone",
  "/api/signup": "everyone",
  "/api/forgot": "everyone",

  "/api/logout": "user",
  "/api/me": "user",
  "/api/workout": "user",

  "/api/admin/users": "admin",
  "/api/admin/stats": "admin",
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "Unknown";

  const userAgent = req.headers.get("user-agent");

  const requiredRole = routePermissions[pathname] ?? "user";

  // Public route
  if (requiredRole === "everyone") {
    console.log(
      "Public route accessed: Method:",
      method,
      "Pathname:",
      pathname,
      "IP:",
      ip,
      "User-Agent:",
      userAgent,
    );

    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    console.log(
      "Unauthorized access attempt: Method:",
      method,
      "Pathname:",
      pathname,
      "IP:",
      ip,
      "User-Agent:",
      userAgent,
    );
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);

  const user = verifyToken(token);

  if (!user) {
    console.log(
      "Invalid token used: Method:",
      method,
      "Pathname:",
      pathname,
      "IP:",
      ip,
      "User-Agent:",
      userAgent,
    );
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    console.log(
      "Unauthorized access attempt: Method:",
      method,
      "Pathname:",
      pathname,
      "IP:",
      ip,
      "User-Agent:",
      userAgent,
    );
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  console.log(
    "Authorized access: Method:",
    method,
    "Pathname:",
    pathname,
    "IP:",
    ip,
    "User-Agent:",
    userAgent,
    "User:",
    user,
    "Role:",
    user.role,
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
