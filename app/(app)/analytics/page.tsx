"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Legend
} from "recharts";
import { AnalyticsData } from "@/types";
import { capitalize, formatDuration } from "@/lib/utils";
import { TrendingUp, Trophy, Flame, Target, Zap, Calendar } from "lucide-react";


const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--bg-elevated) border border-(--border-default) rounded-lg p-3 text-sm shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(30);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?days=${selectedDays}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setSelectedExercise(json.data.strengthProgressions?.[0]?.exerciseName ?? null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedDays]);


  const selectedStrength = data?.strengthProgressions?.find(
    (p) => p.exerciseName === selectedExercise
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-(--bg-card) animate-pulse border border-(--border-subtle)" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="page-container animate-fade-in">
      {/* Header + time filter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground">Analytics</h2>
          <p className="text-(--text-muted) text-sm">Your strength progression data</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDays === d
                  ? "btn-fire"
                  : "border border-(--border-default) text-(--text-secondary) hover:bg-(--bg-hover)"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Workouts", value: data.totalWorkoutsCompleted, icon: Zap, color: "text-(--accent-red)" },
          { label: "Current Streak", value: `${data.currentStreak}d`, icon: Flame, color: "text-(--accent-orange)" },
          { label: "Completion %", value: `${data.weeklyCompletionRate}%`, icon: Target, color: "text-(--accent-green)" },
          { label: "Avg Duration", value: formatDuration(data.avgSessionDuration), icon: Calendar, color: "text-(--accent-blue)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="workout-card p-4">
            <Icon size={16} className={`${color} mb-2`} />
            <p className="text-2xl font-black font-mono gradient-text">{value}</p>
            <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume by muscle */}
        <div className="workout-card p-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-(--accent-red)" />
            Volume by Muscle Group
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.volumeByMuscle.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="muscle" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} width={80}
                tickFormatter={capitalize} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="url(#fireGradBar)" radius={4} name="Volume (kg)" />
              <defs>
                <linearGradient id="fireGradBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e63946" />
                  <stop offset="100%" stopColor="#f77f00" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volume by exercise */}
        <div className="workout-card p-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-4 flex items-center gap-2">
            <Zap size={14} className="text-(--accent-orange)" />
            Volume by Exercise
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.volumeByExercise.slice(0, 6)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="exerciseName" tick={{ fill: "var(--text-secondary)", fontSize: 10 }} width={120} axisLine={false}
                tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 18) + "…" : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="#4895ef" radius={4} name="Volume (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strength progression */}
        <div className="workout-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-(--text-muted) flex items-center gap-2">
              <TrendingUp size={14} className="text-(--accent-green)" />
              Strength Progression
            </h3>
            <select
              value={selectedExercise ?? ""}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-(--bg-elevated) border border-(--border-default) rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-(--accent-red)"
            >
              {data.strengthProgressions.map((p) => (
                <option key={p.exerciseId} value={p.exerciseName}>{p.exerciseName}</option>
              ))}
            </select>
          </div>
          {selectedStrength?.data && selectedStrength.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={selectedStrength.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false}
                  tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#e63946" strokeWidth={2} dot={{ fill: "#e63946", r: 4 }} name="Weight (kg)" />
                <Line type="monotone" dataKey="estimatedOneRM" stroke="#f77f00" strokeWidth={2} strokeDasharray="5 5"
                  dot={{ fill: "#f77f00", r: 3 }} name="Est. 1RM (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-(--text-muted)">
              No data yet for this exercise
            </div>
          )}
        </div>

        {/* Muscle frequency radar */}
        {data.volumeByMuscle.length > 2 && (
          <div className="workout-card p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-4">
              Muscle Frequency
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={data.volumeByMuscle.slice(0, 7)}>
                <PolarGrid stroke="var(--border-subtle)" />
                <PolarAngleAxis dataKey="muscle" tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                  tickFormatter={capitalize} />
                <Radar name="Volume" dataKey="volume" stroke="#e63946" fill="#e63946" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* PRs table */}
        {data.personalRecords.length > 0 && (
          <div className="workout-card p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-(--accent-amber)" />
              Personal Records
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {data.personalRecords.slice(0, 10).map((pr) => (
                <div key={`${pr.exerciseId}`} className="flex items-center justify-between py-2 border-b border-(--border-subtle) last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pr.exerciseName}</p>
                    <p className="text-xs text-(--text-muted)">
                      {pr.weight}kg × {pr.reps}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-(--accent-orange)">{pr.estimatedOneRM.toFixed(1)}</p>
                    <p className="text-[10px] text-(--text-muted)">est. 1RM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
