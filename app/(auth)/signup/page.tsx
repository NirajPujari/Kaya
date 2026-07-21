"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Validation criteria
  const [pwdCriteria, setPwdCriteria] = useState({
    length: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPwdCriteria({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const getPasswordStrength = () => {
    const passed = Object.values(pwdCriteria).filter(Boolean).length;
    if (password.length === 0)
      return { score: 0, text: "", color: "bg-zinc-100" };
    if (passed === 1) return { score: 1, text: "Weak", color: "bg-rose-500" };
    if (passed === 2)
      return { score: 2, text: "Medium", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      toast.success("Account created! Welcome to Kaya.");
    } catch (err: any) {
      setError(
        err.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 normal-case">
          Create Account
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Join Kaya to start logging workouts and tracking progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name
            </label>
            <div className="relative group">
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-[1.2s] ease-in-out group-focus-within:scale-x-100" />
            </div>
          </div>

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
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 pr-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-[1.2s] ease-in-out group-focus-within:scale-x-100" />
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                    Strength
                  </span>
                  <span className="font-bold text-zinc-800 uppercase tracking-wider">
                    {strength.text}
                  </span>
                </div>
                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Confirm Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-0 rounded-md px-2 pr-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />

              {confirmPassword && (
                <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                  )}
                </div>
              )}

              <span
                className={`pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-[1.2s] ease-in-out group-focus-within:scale-x-100 ${
                  confirmPassword && !passwordsMatch
                    ? "scale-x-100 bg-rose-500"
                    : "scale-x-0 bg-primary"
                }`}
              />
            </div>
          </div>

          {/* Signup Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={
                isSubmitting || (confirmPassword !== "" && !passwordsMatch)
              }
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-40 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>

        {/* Login Footer Link */}
        <div className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
