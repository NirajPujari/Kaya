import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Flame,
  Trophy,
  TrendingUp,
  ChevronRight,
  Play,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Niraj. Here is your fitness overview.
          </p>
        </div>
        <Button className="gap-2">
          <Play className="h-4 w-4" fill="currentColor" />
          Start Workout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workouts
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1">
              +4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Personal best: 21 days
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450 kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 / 5</div>
            <Progress value={80} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              1 workout remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>
              You&apos;ve completed 4 workouts this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  name: "Upper Body Power",
                  time: "Today, 10:00 AM",
                  duration: "1h 15m",
                  volume: "4,200 kg",
                  prs: 2,
                },
                {
                  name: "Leg Day Madness",
                  time: "Yesterday, 6:30 PM",
                  duration: "1h 30m",
                  volume: "6,100 kg",
                  prs: 0,
                },
                {
                  name: "Core & Cardio",
                  time: "Wed, 7:00 AM",
                  duration: "45m",
                  volume: "-",
                  prs: 0,
                },
                {
                  name: "Push Day Hypertrophy",
                  time: "Mon, 5:45 PM",
                  duration: "1h 20m",
                  volume: "5,050 kg",
                  prs: 1,
                },
              ].map((workout, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {workout.name[0]}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {workout.name}
                        {workout.prs > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5 bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25"
                          >
                            {workout.prs} PR
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {workout.time} &middot; {workout.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">{workout.volume}</p>
                      <p className="text-xs text-muted-foreground">Volume</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              View All History
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Current Split</CardTitle>
            <CardDescription>
              Your 5-day push/pull/legs routine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: "Monday", routine: "Push Day", status: "completed" },
                { day: "Tuesday", routine: "Pull Day", status: "completed" },
                { day: "Wednesday", routine: "Legs", status: "completed" },
                { day: "Thursday", routine: "Rest", status: "current" },
                { day: "Friday", routine: "Upper Body", status: "upcoming" },
                { day: "Saturday", routine: "Lower Body", status: "upcoming" },
                { day: "Sunday", routine: "Rest", status: "upcoming" },
              ].map((day, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          day.status === "completed"
                            ? "bg-green-500"
                            : day.status === "current"
                              ? "bg-primary animate-pulse"
                              : "bg-muted"
                        }`}
                      />
                      <span
                        className={`text-sm ${day.status === "upcoming" ? "text-muted-foreground" : "font-medium"}`}
                      >
                        {day.day}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {day.routine}
                    </span>
                  </div>
                  {i < 6 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
