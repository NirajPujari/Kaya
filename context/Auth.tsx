"use client";

import { AuthContextType } from "@types/auth";
import {
  ForgotPasswordUser,
  LogInUser,
  SignUpUser,
  User,
} from "@types/user";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (userData: LogInUser) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Login failed");
      }

      const data = await res.json();
      setUser({ token: data.token, name: data.name, email: data.email });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_time", new Date().toString());

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }
  }, []);

  const signup = useCallback(async (userData: SignUpUser) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Signup failed");
      }

      const data = await res.json();
      return { success: data.success };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("token_time");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
  }, []);

  const autoLog = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setUser({ token: data.token, name: data.name, email: data.email });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_time", new Date().toString());

      return { success: true };
    } catch (error) {
      console.error("Auto login error:", error);
      return { success: false };
    }
  }, []);

  const forgot = useCallback(async (userData: ForgotPasswordUser) => {
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Forgot password failed");
      }

      const data = await res.json();
      return { success: data.success };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, autoLog, forgot }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
