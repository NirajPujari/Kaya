"use client";
import { create } from "zustand";
import { WorkoutTemplate, ExerciseLog, LoggedSet } from "@/types";
import { getTodayString } from "@/lib/utils";

interface ActiveExercise {
  exerciseId: string;
  exerciseName: string;
  order: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  notes?: string;
  supersetWith?: string;
  sets: LoggedSet[];
}

interface WorkoutState {
  isActive: boolean;
  template: WorkoutTemplate | null;
  workoutLogId: string | null;
  startedAt: Date | null;
  scheduledDate: string;
  exercises: ActiveExercise[];
  activeExerciseIndex: number;
  restTimerActive: boolean;
  restSecondsLeft: number;
  restTimerDuration: number;

  // Actions
  startWorkout: (template: WorkoutTemplate) => void;
  stopWorkout: () => void;
  addSet: (exerciseIndex: number, set: LoggedSet) => void;
  updateSet: (exerciseIndex: number, setIndex: number, set: Partial<LoggedSet>) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  setActiveExercise: (index: number) => void;
  startRestTimer: (seconds: number) => void;
  tickRestTimer: () => void;
  stopRestTimer: () => void;
  setWorkoutLogId: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  isActive: false,
  template: null,
  workoutLogId: null,
  startedAt: null,
  scheduledDate: getTodayString(),
  exercises: [],
  activeExerciseIndex: 0,
  restTimerActive: false,
  restSecondsLeft: 0,
  restTimerDuration: 90,

  startWorkout: (template) => {
    const exercises: ActiveExercise[] = template.exercises.map((ex) => ({
      ...ex,
      sets: [],
    }));
    set({
      isActive: true,
      template,
      startedAt: new Date(),
      scheduledDate: getTodayString(),
      exercises,
      activeExerciseIndex: 0,
      workoutLogId: null,
    });
  },

  stopWorkout: () => {
    set({
      isActive: false,
      template: null,
      workoutLogId: null,
      startedAt: null,
      exercises: [],
      activeExerciseIndex: 0,
      restTimerActive: false,
    });
  },

  addSet: (exerciseIndex, newSet) => {
    set((state) => {
      const exercises = [...state.exercises];
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        sets: [...exercises[exerciseIndex].sets, newSet],
      };
      return { exercises };
    });
  },

  updateSet: (exerciseIndex, setIndex, updatedSet) => {
    set((state) => {
      const exercises = [...state.exercises];
      const sets = [...exercises[exerciseIndex].sets];
      sets[setIndex] = { ...sets[setIndex], ...updatedSet };
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };
      return { exercises };
    });
  },

  removeSet: (exerciseIndex, setIndex) => {
    set((state) => {
      const exercises = [...state.exercises];
      const sets = exercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };
      return { exercises };
    });
  },

  setActiveExercise: (index) => set({ activeExerciseIndex: index }),

  startRestTimer: (seconds) => {
    set({ restTimerActive: true, restSecondsLeft: seconds, restTimerDuration: seconds });
  },

  tickRestTimer: () => {
    const { restSecondsLeft } = get();
    if (restSecondsLeft <= 1) {
      set({ restTimerActive: false, restSecondsLeft: 0 });
    } else {
      set({ restSecondsLeft: restSecondsLeft - 1 });
    }
  },

  stopRestTimer: () => set({ restTimerActive: false, restSecondsLeft: 0 }),

  setWorkoutLogId: (id) => set({ workoutLogId: id }),
}));
