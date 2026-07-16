"use client";

import { fetchRequest } from "@/lib/api";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const TOKEN_KEY = "jwt_token";
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;

    return !!localStorage.getItem(TOKEN_KEY);
  });

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return;

    fetchRequest("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchRequest("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);

    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetchRequest("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!res.ok) throw new Error("Signup failed");

    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);

    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    await fetchRequest("/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
  };

  const forgot = async (email: string) => {
    const res = await fetchRequest("/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) throw new Error("Failed to send reset email");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgot,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
