import { JwtPayload } from "jsonwebtoken";

export interface User {
  name: string;
  userId: string;
  email: string;
  workoutId: string;
  role: "user" | "admin";
}

export interface TokenPayload extends User, JwtPayload {}
