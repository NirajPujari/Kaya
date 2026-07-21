"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to Kaya!");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 normal-case">
          Log in
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Enter your credentials to access your fitness dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>
            <div className="relative group">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-[1.2s] ease-in-out group-focus-within:scale-x-100" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-wider font-semibold"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full border-0 rounded-md px-2 pr-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <span className="absolute bottom-0 left-0 z-20 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-[1.2s] ease-in-out group-focus-within:scale-x-100" />
            </div>
          </div>

          {/* Remember Me & Login Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </form>

        {/* Signup Footer Link */}
        <div className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
