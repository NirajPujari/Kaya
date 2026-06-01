"use client";
import { useEffect, useState } from "react";
import { Exercise, MuscleGroup, Equipment } from "@/types";
import { capitalize } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "legs", "quads", "hamstrings", "glutes", "calves", "core", "lats",
];

const EQUIPMENT_LIST: Equipment[] = [
  "barbell", "dumbbell", "cable", "machine", "bodyweight", "kettlebell", "ez_bar",
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | "">("");
  const [filterEquipment, setFilterEquipment] = useState<Equipment | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterMuscle) params.set("muscle", filterMuscle);
      if (filterEquipment) params.set("equipment", filterEquipment);
      const res = await fetch(`/api/exercises?${params}`);
      const json = await res.json();
      if (json.success) setExercises(json.data);
      setLoading(false);
    }
    fetchExercises();
  }, [search, filterMuscle, filterEquipment]);


  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">Exercise Library</h2>
        <p className="text-(--text-muted) text-sm mt-1">{exercises.length} exercises</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 bg-(--bg-card) border border-(--border-default) rounded-xl text-foreground placeholder-(--text-muted) focus:outline-none focus:border-(--accent-red) transition-colors"
          />
        </div>
        <select
          value={filterMuscle}
          onChange={(e) => setFilterMuscle(e.target.value as MuscleGroup | "")}
          className="px-4 py-2.5 bg-(--bg-card) border border-(--border-default) rounded-xl text-(--text-secondary) focus:outline-none focus:border-(--accent-red) transition-colors"
        >
          <option value="">All Muscles</option>
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>{capitalize(m)}</option>
          ))}
        </select>
        <select
          value={filterEquipment}
          onChange={(e) => setFilterEquipment(e.target.value as Equipment | "")}
          className="px-4 py-2.5 bg-(--bg-card) border border-(--border-default) rounded-xl text-(--text-secondary) focus:outline-none focus:border-(--accent-red) transition-colors"
        >
          <option value="">All Equipment</option>
          {EQUIPMENT_LIST.map((eq) => (
            <option key={eq} value={eq}>{capitalize(eq)}</option>
          ))}
        </select>
      </div>

      {/* Exercise grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="workout-card p-12 text-center">
          <Dumbbell size={40} className="text-(--text-muted) mx-auto mb-4 opacity-50" />
          <p className="text-(--text-muted)">No exercises found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exercises.map((ex) => {
            const isExpanded = expandedId === ex.exerciseId;
            return (
              <div key={ex.exerciseId} className="workout-card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ex.exerciseId)}
                  className="w-full p-4 flex items-start justify-between text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{ex.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        ex.category === "compound"
                          ? "bg-(--accent-red)/20 text-(--accent-red)"
                          : "bg-(--accent-blue)/20 text-(--accent-blue)"
                      }`}>
                        {ex.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.primaryMuscles.map((m) => (
                        <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-red)/15 text-(--accent-red) font-medium">
                          {capitalize(m)}
                        </span>
                      ))}
                      {ex.secondaryMuscles.slice(0, 2).map((m) => (
                        <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-(--border-default) text-(--text-muted) font-medium">
                          {capitalize(m)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-(--text-muted) capitalize">
                        🏋️ {capitalize(ex.equipment)}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-(--text-muted) ml-2 shrink-0 mt-1" />
                  ) : (
                    <ChevronDown size={16} className="text-(--text-muted) ml-2 shrink-0 mt-1" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-(--border-subtle) pt-3 animate-slide-in">
                    {/* Instructions */}
                    {ex.instructions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-2">Instructions</p>
                        <ol className="space-y-1">
                          {ex.instructions.map((step, i) => (
                            <li key={i} className="flex gap-2 text-sm text-(--text-secondary)">
                              <span className="text-(--accent-red) font-bold shrink-0">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Muscles */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-1">Primary</p>
                        <div className="flex flex-wrap gap-1">
                          {ex.primaryMuscles.map((m) => (
                            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-red)/15 text-(--accent-red) font-medium">
                              {capitalize(m)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-1">Secondary</p>
                        <div className="flex flex-wrap gap-1">
                          {ex.secondaryMuscles.map((m) => (
                            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-(--border-default) text-(--text-muted) font-medium">
                              {capitalize(m)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Alternatives */}
                    {ex.alternatives.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-1">Alternatives</p>
                        <div className="flex flex-wrap gap-1">
                          {ex.alternatives.map((alt) => (
                            <span key={alt} className="text-[10px] px-2 py-0.5 rounded-full border border-(--border-default) text-(--text-muted) hover:border-(--border-accent) cursor-pointer transition-colors">
                              {alt.replace(/-/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
