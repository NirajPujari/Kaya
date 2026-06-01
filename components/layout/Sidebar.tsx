"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  BarChart3,
  BookOpen,
  Calendar,
  DownloadCloud,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout/history", label: "History", icon: Dumbbell },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/exercises", label: "Exercises", icon: BookOpen },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/import-export", label: "Import / Export", icon: DownloadCloud },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-30",
        "border-r border-(--border-subtle)",
        sidebarOpen ? "w-64" : "w-16"
      )}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-(--border-subtle)",
        sidebarOpen ? "gap-3" : "justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg btn-fire flex items-center justify-center shrink-0">
          <Flame size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <span className="gradient-text font-black text-lg tracking-tight">IronLog</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                active
                  ? "bg-fire-subtle text-(--accent-red) border border-(--border-accent)"
                  : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-foreground",
                !sidebarOpen && "justify-center px-2"
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-(--accent-red)" : "text-(--text-muted) group-hover:text-foreground"
                )}
              />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {active && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-(--accent-red)" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 mx-2 mb-4 rounded-lg border border-(--border-subtle) text-(--text-muted) hover:text-foreground hover:bg-(--bg-hover) transition-all"
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
}
