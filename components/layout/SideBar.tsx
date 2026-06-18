"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  Dumbbell,
  History,
  Settings,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Workouts",
    href: "/workouts",
    icon: Activity,
  },
  {
    title: "Exercises",
    href: "/exercises",
    icon: Dumbbell,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
];

const accountItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SideBarContent() {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto py-6">
      {/* Main Menu */}
      <div className="px-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </h2>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Button
                key={item.href}
                asChild
                variant={active ? "default" : "ghost"}
                className="w-full justify-start px-3 py-2.5 transition-all duration-300"
              >
                <Link href={item.href}>
                  <Icon className="size-5" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Account */}
      <div className="px-4 mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </h2>

        <nav className="space-y-1">
          {accountItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Button
                key={item.href}
                asChild
                variant={active ? "default" : "ghost"}
                className="w-full justify-start px-3 py-2.5 transition-all duration-300"
              >
                <Link href={item.href}>
                  <Icon className="size-5" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function SideBar() {
  return (
    <aside className="hidden md:flex w-72 border-r bg-white text-black sticky top-0 h-screen flex-col">
      <div className="flex h-16 items-center px-6 shrink-0">
        <HeartPulse className="h-7 w-7 mr-3 text-primary" />
        <div>
          <h1 className="font-bold text-lg">Kaya</h1>
          <p className="text-xs text-muted-foreground">Fitness Tracker</p>
        </div>
      </div>
      <SideBarContent />
    </aside>
  );
}
