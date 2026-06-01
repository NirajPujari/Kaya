"use client";
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Check, BedDouble, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type DayStatus = "completed" | "rest" | "missed" | "planned" | "future";

interface DayData {
  date: string;
  status: DayStatus;
  workoutName?: string;
}

const STATUS_CONFIG = {
  completed: { bg: "bg-green-500/20", border: "border-green-500/40", text: "text-green-400", icon: Check },
  rest: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", icon: BedDouble },
  missed: { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400", icon: X },
  planned: { bg: "bg-(--bg-elevated)", border: "border-(--border-subtle)", text: "text-(--text-muted)", icon: Calendar },
  future: { bg: "transparent", border: "border-transparent", text: "text-(--text-muted)", icon: Calendar },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    async function fetchMonthData(date: Date) {
      const from = format(startOfMonth(date), "yyyy-MM-dd");
      const to = format(endOfMonth(date), "yyyy-MM-dd");
      try {
        const res = await fetch(`/api/schedule?from=${from}&to=${to}`);
        const json = await res.json();
        if (json.success?.scheduleForRange) {
          setScheduleData(json.success.scheduleForRange);
        } else {
          // Fallback: fetch from schedule endpoint
          const sRes = await fetch(`/api/workout-logs?all=true`);
          const sJson = await sRes.json();
          const rRes = await fetch(`/api/rest-days?userId=default&from=${from}&to=${to}`);
          const rJson = await rRes.json();
  
          const completedDates = new Set<string>(
            sJson.success ? sJson.data.filter((l: {scheduledDate: string; status: string}) => l.status === "completed").map((l: {scheduledDate: string}) => l.scheduledDate) : []
          );
          const restDates = new Set<string>(
            rJson.success ? rJson.data.map((r: {date: string}) => r.date) : []
          );
  
          const today = format(new Date(), "yyyy-MM-dd");
          const days = eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
          const data: DayData[] = days.map((d) => {
            const ds = format(d, "yyyy-MM-dd");
            let status: DayStatus = "future";
            if (completedDates.has(ds)) status = "completed";
            else if (restDates.has(ds)) status = "rest";
            else if (ds < today) status = "missed";
            else if (ds === today) status = "planned";
            return { date: ds, status };
          });
          setScheduleData(data);
        }
      }
      catch {

      }
    }
    fetchMonthData(currentDate);
  }, [currentDate]);


  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const firstDayOfWeek = getDay(startOfMonth(currentDate));
  const completedCount = scheduleData.filter((d) => d.status === "completed").length;
  const restCount = scheduleData.filter((d) => d.status === "rest").length;
  const missedCount = scheduleData.filter((d) => d.status === "missed").length;

  // Calculate streak
  const sortedCompleted = scheduleData
    .filter((d) => d.status === "completed")
    .map((d) => d.date)
    .sort();
  let streak = 0;
  for (let i = sortedCompleted.length - 1; i >= 0; i--) {
    const d = parseISO(sortedCompleted[i]);
    const expected = new Date();
    expected.setDate(expected.getDate() - (sortedCompleted.length - 1 - i));
    if (format(d, "yyyy-MM-dd") === format(expected, "yyyy-MM-dd")) {
      streak++;
    } else break;
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">Workout Calendar</h2>
        <p className="text-(--text-muted) text-sm mt-1">Track your training consistency</p>
      </div>

      {/* Month stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Completed", value: completedCount, color: "text-green-400" },
          { label: "Rest Days", value: restCount, color: "text-amber-400" },
          { label: "Missed", value: missedCount, color: "text-red-400" },
          { label: "Streak", value: `${streak}d`, color: "gradient-text" },
        ].map(({ label, value, color }) => (
          <div key={label} className="workout-card p-4 text-center">
            <p className={`text-2xl font-black font-mono ${color}`}>{value}</p>
            <p className="text-[10px] text-(--text-muted) uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="workout-card p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="p-2 rounded-lg hover:bg-(--bg-hover) text-(--text-muted) transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-lg font-bold text-foreground">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-(--bg-hover) text-(--text-muted) transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-(--text-muted) uppercase py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first week offset */}
          {[...Array(firstDayOfWeek)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayData = scheduleData.find((d) => d.date === dateStr);
            const status = dayData?.status ?? "future";
            const config = STATUS_CONFIG[status];
            const isTodayDay = isToday(day);
            const Icon = config.icon;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(dayData ?? { date: dateStr, status })}
                className={cn(
                  "aspect-square rounded-xl border flex flex-col items-center justify-center transition-all text-[10px] sm:text-xs p-0.5 sm:p-1",
                  config.bg, config.border, config.text,
                  isTodayDay && "ring-2 ring-(--accent-red) ring-offset-1 ring-offset-(--bg-card)",
                  "hover:scale-105 hover:shadow-lg"
                )}
              >
                <span className={cn("font-bold text-xs sm:text-sm", isTodayDay && "gradient-text")}>
                  {format(day, "d")}
                </span>
                <Icon size={10} className="hidden sm:block mt-0.5 opacity-70" />
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-(--border-subtle)">
          {Object.entries(STATUS_CONFIG)
            .filter(([k]) => k !== "future")
            .map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-sm border", config.bg, config.border)} />
                <span className={cn("text-xs capitalize", config.text)}>{status}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Day detail popup */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="glass-card p-6 w-full max-w-sm animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-bold text-foreground">
                  {format(parseISO(selectedDay.date), "EEEE, MMMM d")}
                </p>
                {selectedDay.workoutName && (
                  <p className="text-sm text-(--text-muted)">{selectedDay.workoutName}</p>
                )}
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-(--text-muted) p-1">
                <X size={16} />
              </button>
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg capitalize text-sm font-medium",
              STATUS_CONFIG[selectedDay.status].bg,
              STATUS_CONFIG[selectedDay.status].text
            )}>
              {selectedDay.status}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
