"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  BedDouble,
  TrendingUp,
  Zap,
  Calendar,
  Target,
  Flame,
  ChevronRight,
  Trophy,
  Clock,
} from "lucide-react";
import { ScheduledWorkout, WorkoutLog } from "@/types";
import { formatDuration, formatVolume, formatDateShort } from "@/lib/utils";
import { useWorkoutStore } from "@/store/workoutStore";

interface DashboardData {
  scheduled: ScheduledWorkout | null;
  recentLogs: WorkoutLog[];
  weeklyStats: { completed: number; total: number; volume: number };
  weeklyCompletion: number;
}

function ProgressRing({ value, size = 80 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-default)" strokeWidth={6} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#fireGrad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#f77f00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [takingRest, setTakingRest] = useState(false);
  const { startWorkout } = useWorkoutStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/schedule");
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleTakeRestDay() {
    setTakingRest(true);
    try {
      await fetch("/api/rest-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default", date: new Date().toISOString().split("T")[0] }),
      });
      await fetchDashboard();
    } finally {
      setTakingRest(false);
    }
  }

  function handleStartWorkout() {
    if (data?.scheduled?.template) {
      startWorkout(data.scheduled.template);
      window.location.href = "/workout/active";
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
          ))}
        </div>
      </div>
    );
  }

  const { scheduled, recentLogs, weeklyStats, weeklyCompletion } = data || {};

  return (
    <div className="page-container animate-fade-in">
      {/* Hero greeting */}
      <div className="mb-8 mt-2">
        <p className="text-(--text-muted) text-sm font-medium uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="text-3xl font-black text-foreground">
          Ready to{" "}
          <span className="gradient-text">lift heavy</span>?
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Today's Workout Card (large) ── */}
        <div className="lg:col-span-2">
          <div className="workout-card p-6 h-full">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={16} className="text-(--accent-red)" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-(--accent-red)">
                    Today&apos;s Workout
                  </span>
                </div>
                <h3 className="text-2xl font-black text-foreground">
                  {scheduled?.template?.name ?? "No workout scheduled"}
                </h3>
                <p className="text-(--text-muted) text-sm mt-1">
                  {scheduled?.template?.exercises?.length ?? 0} exercises
                </p>
              </div>
              <div className="stat-badge">
                Day {(scheduled?.template?.dayIndex ?? 0) + 1}
              </div>
            </div>

            {/* Exercise preview */}
            {scheduled?.template?.exercises && (
              <div className="space-y-2 mb-6">
                {scheduled.template.exercises.slice(0, 4).map((ex, i) => (
                  <div
                    key={ex.exerciseId}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-(--bg-elevated) border border-(--border-subtle)"
                  >
                    <span className="w-5 h-5 rounded-full bg-(--border-accent) text-(--accent-red) text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground flex-1">
                      {ex.exerciseName}
                    </span>
                    <span className="text-xs text-(--text-muted) font-mono">
                      {ex.targetSets}×{ex.targetRepsMin}–{ex.targetRepsMax}
                    </span>
                    {ex.supersetWith && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-medium">SS</span>
                    )}
                  </div>
                ))}
                {scheduled.template.exercises.length > 4 && (
                  <p className="text-xs text-(--text-muted) text-center pt-1">
                    +{scheduled.template.exercises.length - 4} more exercises
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleStartWorkout}
                disabled={!scheduled?.template}
                className="flex-1 btn-fire flex items-center justify-center gap-2 py-3 text-base font-bold disabled:opacity-40"
              >
                <Play size={18} fill="white" />
                Start Workout
              </button>
              <button
                onClick={handleTakeRestDay}
                disabled={takingRest}
                className="px-5 py-3 rounded-lg border border-(--border-default) text-(--text-secondary) hover:bg-(--bg-hover) hover:text-foreground transition-all font-medium flex items-center gap-2"
              >
                <BedDouble size={16} />
                <span className="hidden sm:inline">{takingRest ? "Resting..." : "Rest Day"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Weekly Stats Panel ── */}
        <div className="space-y-4">
          {/* Weekly completion ring */}
          <div className="workout-card p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <ProgressRing value={weeklyCompletion ?? 0} size={80} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black gradient-text">{weeklyCompletion ?? 0}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-(--text-muted) uppercase tracking-widest mb-1">Week Progress</p>
              <p className="text-xl font-bold text-foreground">{weeklyStats?.completed ?? 0}/5</p>
              <p className="text-xs text-(--text-muted)">workouts this week</p>
            </div>
          </div>

          {/* Volume stat */}
          <div className="workout-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-(--accent-orange)" />
              <span className="text-xs text-(--text-muted) uppercase tracking-widest">Weekly Volume</span>
            </div>
            <p className="text-3xl font-black font-mono gradient-text">
              {formatVolume(weeklyStats?.volume ?? 0)}
              <span className="text-base font-normal text-(--text-muted) ml-1">kg</span>
            </p>
          </div>

          {/* Quick stats */}
          <div className="workout-card p-5 grid grid-cols-2 gap-3">
            <div>
              <Trophy size={14} className="text-(--accent-amber) mb-1" />
              <p className="text-xl font-black text-foreground">{recentLogs?.length ?? 0}</p>
              <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Sessions</p>
            </div>
            <div>
              <Target size={14} className="text-(--accent-green) mb-1" />
              <p className="text-xl font-black text-foreground">
                {recentLogs?.[0]?.totalSets ?? 0}
              </p>
              <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Last Sets</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Previous Session ── */}
      {scheduled?.previousLog && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-(--text-muted) mb-3">
            Previous {scheduled.template?.name} Session
          </h3>
          <div className="workout-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl btn-fire flex items-center justify-center">
                  <Zap size={16} fill="white" className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{scheduled.previousLog.workoutName}</p>
                  <p className="text-xs text-(--text-muted)">
                    {formatDateShort(scheduled.previousLog.scheduledDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {formatVolume(scheduled.previousLog.totalVolume)}kg
                  </p>
                  <p className="text-[10px] text-(--text-muted)">Volume</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {scheduled.previousLog.totalSets}
                  </p>
                  <p className="text-[10px] text-(--text-muted)">Sets</p>
                </div>
                <div className="flex items-center gap-1 text-(--text-muted)">
                  <Clock size={12} />
                  <span className="text-sm font-mono">
                    {formatDuration(scheduled.previousLog.durationMinutes ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent History ── */}
      {recentLogs && recentLogs.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-(--text-muted)">
              Recent Sessions
            </h3>
            <Link href="/workout/history" className="text-xs text-(--accent-red) hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentLogs.slice(0, 4).map((log) => (
              <Link
                key={log._id?.toString()}
                href={`/workout/${log._id?.toString()}`}
                className="workout-card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-(--bg-elevated) flex items-center justify-center">
                    <Calendar size={14} className="text-(--text-muted)" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.workoutName}</p>
                    <p className="text-xs text-(--text-muted)">{formatDateShort(log.scheduledDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-(--text-secondary)">
                    {formatVolume(log.totalVolume)}kg
                  </span>
                  <span className="text-xs text-(--text-muted)">
                    {log.totalSets} sets
                  </span>
                  <ChevronRight size={14} className="text-(--text-muted) group-hover:text-(--accent-red) transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Setup prompt if no templates */}
      {!scheduled?.template && !loading && (
        <div className="mt-8 workout-card p-8 text-center">
          <Flame size={48} className="text-(--accent-red) mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">No workout plan found</h3>
          <p className="text-(--text-muted) mb-6">
            Seed the database to get started with a sample workout plan.
          </p>
          <button
            onClick={async () => {
              await fetch("/api/seed", { method: "POST" });
              fetchDashboard();
            }}
            className="btn-fire px-8 py-3 font-bold"
          >
            Seed Sample Data
          </button>
        </div>
      )}
    </div>
  );
}
