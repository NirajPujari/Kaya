"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkoutLog, ExerciseLog } from "@/types";
import { formatDateShort, formatDuration, formatVolume } from "@/lib/utils";
import { Dumbbell, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import { calculate1RM } from "@/lib/engine/progression";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [log, setLog] = useState<WorkoutLog | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/workout-logs/${params.id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            setLog(json.data.log);
            setExerciseLogs(json.data.exerciseLogs);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return (
    <div className="page-container">
      <div className="space-y-3 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
        ))}
      </div>
    </div>
  );

  if (!log) return (
    <div className="page-container">
      <p className="text-(--text-muted)">Workout not found.</p>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-(--text-muted) hover:text-foreground mb-4 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="workout-card p-6 mb-6">
        <h2 className="text-2xl font-black text-foreground mb-1">{log.workoutName}</h2>
        <p className="text-(--text-muted) text-sm">{formatDateShort(log.scheduledDate)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <Dumbbell size={14} className="text-(--accent-red) mb-1" />
            <p className="text-xl font-black font-mono gradient-text">{log.totalSets}</p>
            <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Sets</p>
          </div>
          <div>
            <TrendingUp size={14} className="text-(--accent-orange) mb-1" />
            <p className="text-xl font-black font-mono gradient-text">{formatVolume(log.totalVolume)}kg</p>
            <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Volume</p>
          </div>
          <div>
            <Clock size={14} className="text-(--accent-blue) mb-1" />
            <p className="text-xl font-black font-mono gradient-text">{formatDuration(log.durationMinutes ?? 0)}</p>
            <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Duration</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {exerciseLogs.map((ex) => (
          <div key={ex._id?.toString()} className="workout-card p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-foreground">{ex.exerciseName}</h3>
              <span className="text-xs font-mono text-(--accent-orange)">
                {formatVolume(ex.totalVolume)}kg vol
              </span>
            </div>
            <div className="space-y-1.5">
              {ex.sets.filter((s) => s.completed).map((set, i) => (
                <div key={i} className="flex items-center gap-4 py-1.5 px-3 rounded-lg bg-(--bg-elevated)">
                  <span className="text-xs text-(--text-muted) w-6 font-mono">{i + 1}</span>
                  <span className="text-xs text-(--text-muted) capitalize flex-1">{set.type}</span>
                  <span className="font-mono font-bold text-foreground">{set.weight}kg</span>
                  <span className="text-(--text-muted) text-xs">×</span>
                  <span className="font-mono font-bold text-foreground">{set.reps}</span>
                  <span className="text-xs text-(--accent-orange) font-mono ml-auto">
                    {calculate1RM(set.weight, set.reps).toFixed(0)} 1RM
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
