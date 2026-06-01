"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X, Check, ChevronDown, ChevronUp, Timer, Zap,
  AlertTriangle, Trophy, ArrowRight
} from "lucide-react";
import { useWorkoutStore } from "@/store/workoutStore";
import { LoggedSet, SetType } from "@/types";
import { cn } from "@/lib/utils";
import { calculate1RM } from "@/lib/engine/progression";

const SET_TYPE_CONFIG: Record<SetType, { label: string; color: string; bg: string }> = {
  normal: { label: "Normal", color: "text-(--text-secondary)", bg: "bg-(--bg-elevated)" },
  warmup: { label: "Warmup", color: "text-yellow-400", bg: "bg-yellow-900/20" },
  dropset: { label: "Drop Set", color: "text-blue-400", bg: "bg-blue-900/20" },
  superset: { label: "Superset", color: "text-green-400", bg: "bg-green-900/20" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-900/20" },
};

function WorkoutTimer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  }, [startedAt]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return (
    <div className="font-mono text-2xl font-bold gradient-text">
      {h > 0 && `${h}:`}{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}

function RestTimer({ seconds, total, onStop }: { seconds: number; total: number; onStop: () => void }) {
  const pct = (seconds / total) * 100;
  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-40 bg-(--bg-elevated) border border-(--border-accent) rounded-2xl p-4 shadow-2xl w-40">
      <div className="flex items-center justify-between mb-2">
        <Timer size={14} className="text-(--accent-orange)" />
        <button onClick={onStop} className="text-(--text-muted) hover:text-foreground">
          <X size={14} />
        </button>
      </div>
      <div className="text-3xl font-black font-mono text-center gradient-text">{seconds}s</div>
      <div className="mt-2 h-1.5 rounded-full bg-(--border-default) overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: "var(--gradient-fire)",
          }}
        />
      </div>
      <p className="text-[10px] text-center text-(--text-muted) mt-1">Rest</p>
    </div>
  );
}

function AddSetRow({
  exerciseIndex,
  targetRepsMin,
  onAdd,
}: {
  exerciseIndex: number;
  targetRepsMin: number;
  targetRepsMax: number;
  onAdd: (set: LoggedSet, exerciseIndex: number) => void;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState(String(targetRepsMin));
  const [type, setType] = useState<SetType>("normal");
  const [rpe, setRpe] = useState("");

  function handleAdd() {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (r === 0) return;
    onAdd(
      {
        setNumber: 1, // will be overridden
        type,
        weight: w,
        reps: r,
        rpe: rpe ? parseFloat(rpe) : undefined,
        completed: true,
      },
      exerciseIndex
    );
    setWeight("");
    setReps(String(targetRepsMin));
    setType("normal");
  }

  return (
    <div className="bg-(--bg-elevated) rounded-xl p-3 border border-(--border-subtle) mt-2">
      <div className="flex gap-2 mb-2">
        {(["normal", "warmup", "dropset", "superset", "failed"] as SetType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md font-medium capitalize transition-all",
              type === t
                ? `${SET_TYPE_CONFIG[t].bg} ${SET_TYPE_CONFIG[t].color} border border-current`
                : "text-(--text-muted) bg-(--bg-card) border border-transparent"
            )}
          >
            {SET_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-[10px] text-(--text-muted) uppercase tracking-widest">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-full mt-1 bg-(--bg-card) border border-(--border-default) rounded-lg px-3 py-2 text-foreground font-mono font-bold text-lg focus:outline-none focus:border-(--accent-red) transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-(--text-muted) uppercase tracking-widest">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder={String(targetRepsMin)}
            className="w-full mt-1 bg-(--bg-card) border border-(--border-default) rounded-lg px-3 py-2 text-foreground font-mono font-bold text-lg focus:outline-none focus:border-(--accent-red) transition-colors"
          />
        </div>
        <div className="w-16">
          <label className="text-[10px] text-(--text-muted) uppercase tracking-widest">RPE</label>
          <input
            type="number"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            placeholder="–"
            min={1}
            max={10}
            step={0.5}
            className="w-full mt-1 bg-(--bg-card) border border-(--border-default) rounded-lg px-3 py-2 text-foreground font-mono text-base focus:outline-none focus:border-(--accent-red) transition-colors"
          />
        </div>
        <button
          onClick={handleAdd}
          className="btn-fire w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-0"
        >
          <Check size={18} />
        </button>
      </div>
      {weight && reps && (
        <p className="text-[10px] text-(--text-muted) mt-2 font-mono">
          Estimated 1RM: <span className="text-(--accent-orange)">{calculate1RM(parseFloat(weight), parseInt(reps)).toFixed(1)}kg</span>
        </p>
      )}
    </div>
  );
}

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const {
    isActive, template, startedAt, exercises,
    addSet, removeSet, startRestTimer, restTimerActive,
    restSecondsLeft, restTimerDuration, tickRestTimer, stopRestTimer,
    stopWorkout,
  } = useWorkoutStore();

  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [completing, setCompleting] = useState(false);
  const [newPRs, setNewPRs] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) router.replace("/dashboard");
  }, [isActive, router]);

  useEffect(() => {
    if (restTimerActive) {
      timerRef.current = setInterval(tickRestTimer, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restTimerActive, tickRestTimer]);

  const handleAddSet = useCallback(
    (set: LoggedSet, exerciseIndex: number) => {
      const setsForEx = exercises[exerciseIndex]?.sets ?? [];
      const numbered: LoggedSet = {
        ...set,
        setNumber: setsForEx.filter((s) => s.type !== "warmup").length + 1,
      };
      addSet(exerciseIndex, numbered);
      // Start rest timer
      startRestTimer(exercises[exerciseIndex]?.restSeconds ?? 90);
    },
    [exercises, addSet, startRestTimer]
  );

  async function handleComplete() {
    if (!template || !startedAt) return;
    setCompleting(true);

    const durationMinutes = Math.floor((Date.now() - startedAt.getTime()) / 60000);

    const exerciseLogs = exercises.map((ex) => ({
      userId: "default",
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      order: ex.order,
      sets: ex.sets,
      totalVolume: ex.sets
        .filter((s) => s.completed)
        .reduce((sum, s) => sum + s.weight * s.reps, 0),
    }));

    try {
      const res = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutData: {
            userId: "default",
            workoutTemplateId: template._id?.toString(),
            workoutName: template.name,
            dayIndex: template.dayIndex,
            scheduledDate: new Date().toISOString().split("T")[0],
            status: "completed",
          },
          exerciseLogs,
          durationMinutes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const prs = json.data?.newPRs?.map((p: { exerciseName: string }) => p.exerciseName) ?? [];
        setNewPRs(prs);
        stopWorkout();
        setTimeout(() => router.push("/dashboard"), prs.length > 0 ? 3000 : 500);
      }
    } finally {
      setCompleting(false);
    }
  }

  if (!isActive || !template) return null;

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0);
  const totalVolume = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).reduce((a, s) => a + s.weight * s.reps, 0),
    0
  );

  return (
    <div className="page-container animate-fade-in">
      {/* PR celebration overlay */}
      {newPRs.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 text-center max-w-sm mx-4 animate-slide-in">
            <Trophy size={48} className="text-(--accent-amber) mx-auto mb-4" />
            <h2 className="text-2xl font-black gradient-text mb-2">New PRs!</h2>
            <p className="text-(--text-secondary) mb-4">You crushed it today 🔥</p>
            <div className="space-y-1">
              {newPRs.map((name) => (
                <div key={name} className="stat-badge inline-block mx-1">{name}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-(--accent-red) pulse-active" />
            <span className="text-xs text-(--accent-red) font-semibold uppercase tracking-widest">Active</span>
          </div>
          <h2 className="text-xl font-black text-foreground">{template.name}</h2>
        </div>
        <WorkoutTimer startedAt={startedAt!} />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-(--bg-card) rounded-xl p-3 text-center border border-(--border-subtle)">
          <p className="text-xl font-black font-mono gradient-text">{totalSets}</p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Sets</p>
        </div>
        <div className="bg-(--bg-card) rounded-xl p-3 text-center border border-(--border-subtle)">
          <p className="text-xl font-black font-mono gradient-text">{totalVolume.toLocaleString()}</p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Vol (kg)</p>
        </div>
        <div className="bg-(--bg-card) rounded-xl p-3 text-center border border-(--border-subtle)">
          <p className="text-xl font-black font-mono gradient-text">
            {exercises.filter((ex) => ex.sets.some((s) => s.completed)).length}/{exercises.length}
          </p>
          <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">Exercises</p>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="space-y-3">
        {exercises.map((ex, exIdx) => {
          const isExpanded = expandedIndex === exIdx;
          const completedSets = ex.sets.filter((s) => s.completed).length;
          const isDone = completedSets >= ex.targetSets;

          return (
            <div
              key={ex.exerciseId}
              className={cn(
                "workout-card overflow-hidden transition-all",
                isDone && "border-(--accent-green)/30 bg-green-950/10"
              )}
            >
              {/* Exercise header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? -1 : exIdx)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                      isDone ? "bg-green-500/20 text-green-400" : "btn-fire text-white"
                    )}
                  >
                    {isDone ? <Check size={16} /> : exIdx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {ex.exerciseName}
                      {ex.supersetWith && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-medium">SS</span>
                      )}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {ex.targetSets} sets × {ex.targetRepsMin}–{ex.targetRepsMax} reps
                      <span className="ml-2 font-mono">{completedSets}/{ex.targetSets} done</span>
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-(--text-muted)" />
                ) : (
                  <ChevronDown size={16} className="text-(--text-muted)" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-slide-in">
                  {/* Sets table */}
                  {ex.sets.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-5 gap-1 mb-1 px-1">
                        {["Set", "Type", "Weight", "Reps", "1RM"].map((h) => (
                          <span key={h} className="text-[10px] text-(--text-muted) uppercase tracking-widest">{h}</span>
                        ))}
                      </div>
                      {ex.sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className={cn(
                            "grid grid-cols-5 gap-1 px-1 py-2 rounded-lg items-center",
                            SET_TYPE_CONFIG[set.type].bg
                          )}
                        >
                          <span className="font-mono text-sm text-(--text-secondary)">{setIdx + 1}</span>
                          <span className={cn("text-xs font-medium", SET_TYPE_CONFIG[set.type].color)}>
                            {SET_TYPE_CONFIG[set.type].label}
                          </span>
                          <span className="font-mono font-bold text-foreground">{set.weight}kg</span>
                          <span className="font-mono font-bold text-foreground">{set.reps}</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-(--accent-orange)">
                              {calculate1RM(set.weight, set.reps).toFixed(0)}
                            </span>
                            <button
                              onClick={() => removeSet(exIdx, setIdx)}
                              className="text-(--text-muted) hover:text-red-400 ml-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add set form */}
                  <AddSetRow
                    exerciseIndex={exIdx}
                    targetRepsMin={ex.targetRepsMin}
                    targetRepsMax={ex.targetRepsMax}
                    onAdd={handleAddSet}
                  />

                  {ex.notes && (
                    <p className="text-xs text-(--text-muted) mt-2 italic">{ex.notes}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleComplete}
          disabled={completing || totalSets === 0}
          className="flex-1 btn-fire py-4 text-lg font-black flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {completing ? (
            <>Saving...</>
          ) : (
            <>
              <Zap size={20} fill="white" />
              Complete Workout
              <ArrowRight size={18} />
            </>
          )}
        </button>
        <button
          onClick={() => {
            stopWorkout();
            router.push("/dashboard");
          }}
          className="px-5 py-4 rounded-xl border border-(--border-default) text-(--text-muted) hover:text-red-400 hover:border-red-400/30 transition-all"
          title="Cancel workout"
        >
          <AlertTriangle size={18} />
        </button>
      </div>

      {/* Rest timer */}
      {restTimerActive && (
        <RestTimer
          seconds={restSecondsLeft}
          total={restTimerDuration}
          onStop={stopRestTimer}
        />
      )}
    </div>
  );
}
