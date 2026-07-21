import { HeartPulse, CheckCircle2, TrendingUp, Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full select-none bg-muted/10 text-foreground">
      {/* Visual Left Panel (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-50 p-12 lg:flex border-r border-border overflow-hidden">
        {/* Glowing background meshes */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-600/5 blur-[120px]" />

        {/* Brand Section */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-primary/20">
            <HeartPulse className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">Kaya</span>
        </div>

        {/* Middle Value Proposition & Preview */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
              Transform your body. <br />
              Track your strength path.
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Kaya is a professional workout tracker designed to keep your training simple, structured, and focused. Log workouts, analyze performance metrics, and push your personal records.
            </p>
          </div>

          {/* Premium Glassmorphic Card Preview */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-white/70 p-6 backdrop-blur-md shadow-md text-zinc-900">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-xl"></div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Active Workout</span>
                <h4 className="text-base font-bold text-zinc-900">Hypertrophy - Push Day A</h4>
              </div>
              <div className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                <span className="text-zinc-500 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Current Set</span>
                <span className="font-semibold text-zinc-800">Set 3 of 4</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                <span className="text-zinc-500 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-primary" /> Volume Progression</span>
                <span className="font-semibold text-zinc-800">12,450 kg (+12%)</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                <span>Workout Completion</span>
                <span className="text-primary font-semibold">75%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <ul className="space-y-3.5">
            <li className="flex items-center gap-3 text-sm text-zinc-600">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Log dynamic sets, reps, and workout volume</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-zinc-600">Track streak consistency and hit weekly fitness goals</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-zinc-600">Analyze workouts with comprehensive history logs</span>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-zinc-400">
          © {new Date().getFullYear()} Kaya Fitness. All rights reserved.
        </div>
      </div>

      {/* Forms Right Panel */}
      <div className="relative flex w-full flex-col justify-center items-center p-6 md:p-12 lg:w-1/2 overflow-y-auto">
        {/* Subtle background glow for mobile */}
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-primary/5 blur-[80px] lg:hidden" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-violet-600/5 blur-[80px] lg:hidden" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
