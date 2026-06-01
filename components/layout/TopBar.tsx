"use client";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { useWorkoutStore } from "@/store/workoutStore";
import Link from "next/link";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analytics": "Analytics",
  "/exercises": "Exercise Library",
  "/calendar": "Workout Calendar",
  "/import-export": "Import & Export",
  "/workout/history": "Workout History",
};

export function TopBar() {
  const pathname = usePathname();
  const { isActive, template } = useWorkoutStore();

  const title =
    titles[pathname] ||
    (pathname.startsWith("/workout/") && !pathname.includes("history")
      ? "Active Workout"
      : "IronLog");

  return (
    <header className="h-16 border-b border-(--border-subtle) flex items-center px-6 gap-4 sticky top-0 z-20 bg-(--bg-base)/80 backdrop-blur-md">
      <div className="flex-1">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>

      {/* Active workout indicator */}
      {isActive && template && (
        <Link
          href={`/workout/active`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-(--border-accent) bg-fire-subtle text-(--accent-red) text-sm font-medium pulse-active"
        >
          <Zap size={14} fill="currentColor" />
          <span className="hidden sm:inline">Workout Active</span>
        </Link>
      )}

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full btn-fire flex items-center justify-center text-white text-xs font-bold">
          AT
        </div>
      </div>
    </header>
  );
}
