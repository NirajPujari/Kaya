import { ObjectId } from "mongodb";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type SetType = "normal" | "warmup" | "dropset" | "superset" | "failed";
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "forearms"
  | "traps"
  | "lats"
  | "cardio";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "kettlebell"
  | "bands"
  | "smith_machine"
  | "ez_bar"
  | "trap_bar";

export type DayStatus = "completed" | "rest" | "missed" | "planned";

// ─── Collections ──────────────────────────────────────────────────────────────

export interface User {
  _id?: ObjectId;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  currentWorkoutIndex: number; // which workout in the template we're on
  totalWorkoutsCompleted: number;
}

export interface ExerciseInTemplate {
  exerciseId: string;
  exerciseName: string;
  order: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  notes?: string;
  supersetWith?: string; // exerciseId of paired exercise
}

export interface WorkoutTemplate {
  _id?: ObjectId;
  userId: string;
  name: string; // e.g. "Day A — Upper Strength"
  dayIndex: number; // position in rotation (0, 1, 2, ...)
  exercises: ExerciseInTemplate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  _id?: ObjectId;
  exerciseId: string; // slug e.g. "barbell-bench-press"
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  category: string; // "compound" | "isolation"
  instructions: string[];
  alternatives: string[]; // exerciseIds
  imageUrl?: string;
  createdAt: Date;
}

export interface LoggedSet {
  setNumber: number;
  type: SetType;
  weight: number; // kg
  reps: number;
  rpe?: number; // 1-10
  completed: boolean;
  notes?: string;
  supersetGroup?: string; // group label e.g. "A"
}

export interface ExerciseLog {
  _id?: ObjectId;
  workoutLogId: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  sets: LoggedSet[];
  totalVolume: number; // sum(weight * reps)
  notes?: string;
  loggedAt: Date;
}

export interface WorkoutLog {
  _id?: ObjectId;
  userId: string;
  workoutTemplateId: string;
  workoutName: string;
  dayIndex: number;
  scheduledDate: string; // ISO date string YYYY-MM-DD
  startedAt: Date;
  completedAt?: Date;
  durationMinutes?: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  exerciseCount: number;
  status: "in_progress" | "completed" | "abandoned";
  notes?: string;
}

export interface PersonalRecord {
  _id?: ObjectId;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimatedOneRM: number;
  achievedAt: Date;
  workoutLogId: string;
}

export interface RestDay {
  _id?: ObjectId;
  userId: string;
  date: string; // YYYY-MM-DD
  reason?: string;
  createdAt: Date;
}

export interface UserSettings {
  _id?: ObjectId;
  userId: string;
  weightUnit: "kg" | "lbs";
  defaultRestSeconds: number;
  progressionModel: "strength" | "hypertrophy";
  theme: "dark";
  updatedAt: Date;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Schedule Types ───────────────────────────────────────────────────────────

export interface ScheduledWorkout {
  template: WorkoutTemplate;
  scheduledDate: string;
  isToday: boolean;
  previousLog?: WorkoutLog | null;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface VolumeByMuscle {
  muscle: string;
  volume: number;
  sets: number;
}

export interface VolumeByExercise {
  exerciseName: string;
  volume: number;
  sessions: number;
}

export interface StrengthDataPoint {
  date: string;
  weight: number;
  reps: number;
  estimatedOneRM: number;
}

export interface StrengthProgression {
  exerciseId: string;
  exerciseName: string;
  data: StrengthDataPoint[];
  currentMax: number;
  startMax: number;
  improvement: number;
}

export interface ConsistencyData {
  date: string;
  status: DayStatus;
  workoutName?: string;
  volume?: number;
}

export interface AnalyticsData {
  volumeByMuscle: VolumeByMuscle[];
  volumeByExercise: VolumeByExercise[];
  strengthProgressions: StrengthProgression[];
  consistencyData: ConsistencyData[];
  personalRecords: PersonalRecord[];
  weeklyCompletionRate: number;
  totalWorkoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  avgSessionDuration: number;
  totalVolumeLifted: number;
}

// ─── Progression Types ────────────────────────────────────────────────────────

export interface ProgressionSuggestion {
  exerciseId: string;
  exerciseName: string;
  currentWeight: number;
  suggestedWeight: number;
  suggestedReps: number;
  reason: string;
  isDeload: boolean;
}
