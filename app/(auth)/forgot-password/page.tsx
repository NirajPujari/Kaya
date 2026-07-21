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
import { Mail, Loader2, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { forgot } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgot(email);
      setIsSuccess(true);
      toast.success("Instructions sent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="hover:shadow-md transition-shadow bg-card border-border border text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Success Visual */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 normal-case">
              Check your email
            </CardTitle>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
              We have sent password reset instructions to{" "}
              <span className="text-zinc-800 font-medium">{email}</span>. Please
              verify your inbox and spam folders.
            </p>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/20"
            >
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Log In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-card border-border border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 normal-case">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Enter your email address and we will send you instructions to reset
          your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* Forgot Password Form */}
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

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-[1200ms] ease-in-out group-focus-within:scale-x-100" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all py-6 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Instructions...
                </>
              ) : (
                "Send Instructions"
              )}
            </Button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="text-center text-sm mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
