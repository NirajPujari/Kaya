"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  BarChart3,
  BookOpen,
  Calendar,
  Menu,
  X,
  Flame,
  DownloadCloud,
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

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavOpen, toggleMobileNav } = useUIStore();

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-(--border-subtle) bg-(--bg-surface)/95 backdrop-blur-sm">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 4).map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all",
                  active ? "text-(--accent-red)" : "text-(--text-muted)"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={toggleMobileNav}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-(--text-muted)"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Drawer for remaining items */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMobileNav} />
          <div className="absolute bottom-0 left-0 right-0 bg-(--bg-elevated) rounded-t-2xl border-t border-(--border-default) p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-(--accent-red)" />
                <span className="gradient-text font-black text-lg">IronLog</span>
              </div>
              <button onClick={toggleMobileNav} className="text-(--text-muted) p-1">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMobileNav}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      active
                        ? "bg-fire-subtle text-(--accent-red) border border-(--border-accent)"
                        : "text-(--text-secondary) hover:bg-(--bg-hover)"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
