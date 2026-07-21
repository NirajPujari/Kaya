"use client";

import { useAuth } from "@/context/Auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { HeartPulse } from "lucide-react";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = AUTH_PAGES.includes(pathname);

  useEffect(() => {
    if (loading || !mounted) return;

    if (!user && !isAuthPage) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [user, loading, isAuthPage, router, mounted]);

  // Loading indicator component
  const LoadingScreen = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="relative flex flex-col items-center">
        {/* Glowing aura */}
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        {/* Main logo pulse */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-bounce">
          <HeartPulse className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <h2 className="mt-6 text-sm font-semibold tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading Kaya
        </h2>
      </div>
    </div>
  );

  // Prevent hydration mismatch
  if (!mounted) {
    return <LoadingScreen />;
  }

  // If session is loading, show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated and trying to access a protected page, show loading screen while redirecting
  if (!user && !isAuthPage) {
    return <LoadingScreen />;
  }

  // If user is authenticated and trying to access auth pages, show loading screen while redirecting
  if (user && isAuthPage) {
    return <LoadingScreen />;
  }

  // Render auth pages directly (standalone, no dashboard panels)
  if (isAuthPage) {
    return <main className="flex-1 flex flex-col min-h-screen bg-muted/10 text-foreground">{children}</main>;
  }

  // Standard dashboard layout for authenticated users
  return (
    <div className="relative flex min-h-screen">
      <SideBar />
      <div className="flex flex-1 flex-col w-full">
        <TopBar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 bg-muted/10 p-6 md:p-8">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
