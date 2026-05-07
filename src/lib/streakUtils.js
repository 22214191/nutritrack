// =============================================
// STREAK UTILITIES
// These functions calculate the streak and
// today's completed tasks from raw data arrays.
// Imported by Dashboard.jsx
// =============================================

import { format, subDays } from "date-fns";

/**
 * calculateStreak
 * Counts how many consecutive days (going backwards from today)
 * had at least 1 meal AND at least 1 workout logged.
 *
 * @param {Array} meals    - all meal objects from Firestore
 * @param {Array} workouts - all workout objects from Firestore
 * @returns {number} streak count
 */
export function calculateStreak(meals, workouts) {
  // Build a map: { "2026-05-07": Set(["breakfast", "lunch"]) }
  const mealsByDate = {};
  meals.forEach((m) => {
    if (!mealsByDate[m.date]) mealsByDate[m.date] = new Set();
    mealsByDate[m.date].add(m.meal_type);
  });

  // Build a set of dates that have at least one workout
  const workoutDates = new Set(workouts.map((w) => w.date));

  let streak = 0;
  let current = new Date();

  // Loop backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const dateStr = format(current, "yyyy-MM-dd");
    const hasAnyMeal = mealsByDate[dateStr] && mealsByDate[dateStr].size > 0;
    const hasWorkout = workoutDates.has(dateStr);

    if (hasAnyMeal && hasWorkout) {
      streak++;
      current = subDays(current, 1); // go back one more day
    } else if (i === 0) {
      // Today might not be complete yet — skip to yesterday and keep going
      current = subDays(current, 1);
      continue;
    } else {
      break; // streak is broken
    }
  }

  return streak;
}

/**
 * getTodayCompletedTasks
 * Returns an array of task keys that are done today.
 * Used by DailyProgress to render the checklist.
 *
 * @returns {string[]} e.g. ["breakfast", "workout"]
 */
export function getTodayCompletedTasks(meals, workouts) {
  const today = format(new Date(), "yyyy-MM-dd");

  // Filter to today's records only
  const todayMeals    = meals.filter((m) => m.date === today);
  const todayWorkouts = workouts.filter((w) => w.date === today);

  // Build a set of meal types logged today
  const mealTypes = new Set(todayMeals.map((m) => m.meal_type));

  const completed = [];
  if (mealTypes.has("breakfast")) completed.push("breakfast");
  if (mealTypes.has("lunch"))     completed.push("lunch");
  if (mealTypes.has("dinner"))    completed.push("dinner");
  if (todayWorkouts.length > 0)   completed.push("workout");

  return completed;
}
