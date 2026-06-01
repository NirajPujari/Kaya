import { z } from "zod";

export const SetSchema = z.object({
  setNumber: z.number().int().positive(),
  type: z.enum(["normal", "warmup", "dropset", "superset", "failed"]),
  weight: z.number().min(0),
  reps: z.number().int().min(0),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean(),
  notes: z.string().optional(),
  supersetGroup: z.string().optional(),
});

export const ExerciseLogSchema = z.object({
  workoutLogId: z.string(),
  userId: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  order: z.number().int(),
  sets: z.array(SetSchema),
  totalVolume: z.number(),
  notes: z.string().optional(),
});

export const WorkoutLogSchema = z.object({
  userId: z.string(),
  workoutTemplateId: z.string(),
  workoutName: z.string(),
  dayIndex: z.number().int(),
  scheduledDate: z.string(),
  status: z.enum(["in_progress", "completed", "abandoned"]),
  notes: z.string().optional(),
});

export const CompleteWorkoutSchema = z.object({
  workoutLogId: z.string(),
  exerciseLogs: z.array(ExerciseLogSchema),
  durationMinutes: z.number().int().positive(),
  notes: z.string().optional(),
});

export const ExerciseInTemplateSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  order: z.number().int(),
  targetSets: z.number().int().positive(),
  targetRepsMin: z.number().int().positive(),
  targetRepsMax: z.number().int().positive(),
  restSeconds: z.number().int().positive(),
  notes: z.string().optional(),
  supersetWith: z.string().optional(),
});

export const WorkoutTemplateSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  dayIndex: z.number().int().min(0),
  exercises: z.array(ExerciseInTemplateSchema),
});

export const RestDaySchema = z.object({
  userId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
});

export type SetInput = z.infer<typeof SetSchema>;
export type ExerciseLogInput = z.infer<typeof ExerciseLogSchema>;
export type WorkoutLogInput = z.infer<typeof WorkoutLogSchema>;
export type CompleteWorkoutInput = z.infer<typeof CompleteWorkoutSchema>;
export type WorkoutTemplateInput = z.infer<typeof WorkoutTemplateSchema>;
export type RestDayInput = z.infer<typeof RestDaySchema>;
