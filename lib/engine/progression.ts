import { LoggedSet, ExerciseLog, ProgressionSuggestion } from "@/types";

/**
 * Epley 1RM formula: weight * (1 + reps/30)
 * Best for 1-10 rep ranges.
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Brzycki formula (alternative, good for low reps)
 */
export function calculate1RMBrzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // formula breaks down
  return Math.round((weight / (1.0278 - 0.0278 * reps)) * 10) / 10;
}

/**
 * Get the max working set from a list of sets.
 * Excludes warmup sets.
 */
export function getMaxSet(sets: LoggedSet[]): LoggedSet | null {
  const workingSets = sets.filter(
    (s) => s.completed && s.type !== "warmup" && s.weight > 0
  );
  if (workingSets.length === 0) return null;
  return workingSets.reduce((best, s) => {
    const bestRM = calculate1RM(best.weight, best.reps);
    const sRM = calculate1RM(s.weight, s.reps);
    return sRM > bestRM ? s : best;
  });
}

/**
 * Calculate total volume for a list of sets.
 */
export function calculateVolume(sets: LoggedSet[]): number {
  return sets
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.weight * s.reps, 0);
}

/**
 * Suggest next session's weight/rep target.
 * Strategy (Strength-first):
 * - If user hit the TOP of their rep range on all working sets → increase weight
 * - If user hit bottom of rep range → stay at same weight
 * - If user failed below bottom → deload 10%
 */
export function suggestProgression(
  exerciseId: string,
  exerciseName: string,
  lastLog: ExerciseLog,
  targetRepsMin: number,
  targetRepsMax: number,
  weightIncrement = 2.5
): ProgressionSuggestion {
  const workingSets = lastLog.sets.filter(
    (s) => s.completed && s.type !== "warmup" && s.weight > 0 && s.reps > 0
  );

  if (workingSets.length === 0) {
    return {
      exerciseId,
      exerciseName,
      currentWeight: 0,
      suggestedWeight: 20,
      suggestedReps: targetRepsMin,
      reason: "No previous data. Start light.",
      isDeload: false,
    };
  }

  const lastWeight = workingSets[workingSets.length - 1].weight;
  const allReps = workingSets.map((s) => s.reps);
  const minReps = Math.min(...allReps);
  const avgReps = allReps.reduce((a, b) => a + b, 0) / allReps.length;

  let suggestedWeight = lastWeight;
  let suggestedReps = targetRepsMin;
  let reason = "";
  let isDeload = false;

  if (avgReps >= targetRepsMax) {
    // Hit top of range → increase weight
    suggestedWeight = lastWeight + weightIncrement;
    suggestedReps = targetRepsMin;
    reason = `You hit ${Math.round(avgReps)} reps (target max: ${targetRepsMax}). Time to add weight! 💪`;
  } else if (minReps < targetRepsMin) {
    if (minReps < targetRepsMin - 2) {
      // Failed significantly → deload
      suggestedWeight = Math.round(lastWeight * 0.9 * 4) / 4; // round to 0.25
      suggestedReps = targetRepsMin;
      reason = `You struggled at ${minReps} reps. Deload to rebuild form.`;
      isDeload = true;
    } else {
      // Slightly below → stay same weight
      suggestedWeight = lastWeight;
      suggestedReps = targetRepsMin;
      reason = `Keep working at ${lastWeight}kg — aim for ${targetRepsMin}-${targetRepsMax} reps.`;
    }
  } else {
    // In range → stay same weight, aim higher
    suggestedWeight = lastWeight;
    suggestedReps = Math.min(targetRepsMax, Math.round(avgReps) + 1);
    reason = `Good work! Keep adding reps. Aim for ${suggestedReps} this session.`;
  }

  return {
    exerciseId,
    exerciseName,
    currentWeight: lastWeight,
    suggestedWeight,
    suggestedReps,
    reason,
    isDeload,
  };
}

/**
 * Determine if any set qualifies as a new PR.
 */
export function findNewPRs(sets: LoggedSet[], currentBest1RM: number): {
  isPR: boolean;
  weight: number;
  reps: number;
  estimatedOneRM: number;
} | null {
  const workingSets = sets.filter(
    (s) => s.completed && s.type !== "warmup" && s.weight > 0 && s.reps > 0
  );

  let bestSet: { weight: number; reps: number; oneRM: number } | null = null;

  for (const s of workingSets) {
    const oneRM = calculate1RM(s.weight, s.reps);
    if (!bestSet || oneRM > bestSet.oneRM) {
      bestSet = { weight: s.weight, reps: s.reps, oneRM };
    }
  }

  if (!bestSet || bestSet.oneRM <= currentBest1RM) return null;

  return {
    isPR: true,
    weight: bestSet.weight,
    reps: bestSet.reps,
    estimatedOneRM: bestSet.oneRM,
  };
}
