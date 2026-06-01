"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, TrendingUp, Dumbbell, ChevronRight } from "lucide-react";
import { WorkoutLog } from "@/types";
import { formatDateShort, formatDuration, formatVolume } from "@/lib/utils";

export default function WorkoutHistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workout-logs?all=true")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setLogs(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="space-y-3 mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
          ))}
        </div>
      </div>
    );
  }

  const completedLogs = logs.filter((l) => l.status === "completed");
  const totalVolume = completedLogs.reduce((sum, l) => sum + l.totalVolume, 0);
  const avgDuration = completedLogs.length > 0
    ? completedLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0) / completedLogs.length
    : 0;

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">Workout History</h2>
        <p className="text-(--text-muted) text-sm mt-1">{completedLogs.length} completed sessions</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="workout-card p-4 text-center">
          <Dumbbell size={16} className="text-(--accent-red) mx-auto mb-1" />
          <p className="text-2xl font-black font-mono gradient-text">{completedLogs.length}</p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Total Sessions</p>
        </div>
        <div className="workout-card p-4 text-center">
          <TrendingUp size={16} className="text-(--accent-orange) mx-auto mb-1" />
          <p className="text-2xl font-black font-mono gradient-text">{formatVolume(totalVolume)}</p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Total Volume (kg)</p>
        </div>
        <div className="workout-card p-4 text-center">
          <Clock size={16} className="text-(--accent-blue) mx-auto mb-1" />
          <p className="text-2xl font-black font-mono gradient-text">{formatDuration(Math.round(avgDuration))}</p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Avg Duration</p>
        </div>
      </div>

      {/* Log list */}
      {completedLogs.length === 0 ? (
        <div className="workout-card p-12 text-center">
          <Dumbbell size={40} className="text-(--text-muted) mx-auto mb-4 opacity-50" />
          <p className="text-(--text-muted)">No completed workouts yet. Start one from the dashboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {completedLogs.map((log) => (
            <Link
              key={log._id?.toString()}
              href={`/workout/${log._id?.toString()}`}
              className="workout-card p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl btn-fire flex items-center justify-center">
                  <Dumbbell size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{log.workoutName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-(--text-muted)">
                      <Calendar size={10} />
                      {formatDateShort(log.scheduledDate)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-(--text-muted)">
                      <Clock size={10} />
                      {formatDuration(log.durationMinutes ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-foreground">{formatVolume(log.totalVolume)}kg</p>
                  <p className="text-[10px] text-(--text-muted)">{log.totalSets} sets · {log.exerciseCount} exercises</p>
                </div>
                <ChevronRight size={16} className="text-(--text-muted) group-hover:text-(--accent-red) transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
