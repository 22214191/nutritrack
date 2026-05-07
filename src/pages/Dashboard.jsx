// =============================================
// DASHBOARD PAGE
// The home screen. Fetches all meals and workouts
// from Firebase, then passes them to child components.
// =============================================

import { useQuery } from "@tanstack/react-query";
import { getAllMeals, getAllWorkouts } from "@/api/firebase";
import { format, startOfWeek } from "date-fns";
import StreakCounter  from "@/components/dashboard/StreakCounter";
import DailyProgress  from "@/components/dashboard/DailyProgress";
import QuickStats     from "@/components/dashboard/QuickStats";
import { calculateStreak, getTodayCompletedTasks } from "@/lib/streakUtils";

// Simple skeleton placeholder shown while data loads
function Skeleton({ style }) {
  return (
    <div style={{
      background: "var(--surface2)", borderRadius: 16,
      animation: "pulse 1.5s ease-in-out infinite",
      ...style,
    }} />
  );
}

export default function Dashboard() {
  const today     = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  // useQuery fetches data and caches it
  // queryKey is a unique ID — React Query uses this to cache and invalidate
  const { data: meals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ["meals-all"],
    queryFn:  getAllMeals,
  });

  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ["workouts-all"],
    queryFn:  getAllWorkouts,
  });

  const isLoading = mealsLoading || workoutsLoading;

  // --- Derived data (computed from raw arrays) ---

  // Streak = consecutive days with meal + workout
  const streak = calculateStreak(meals, workouts);

  // Which of today's 4 tasks are done?
  const completedTasks = getTodayCompletedTasks(meals, workouts);

  // Filter to just today's records
  const todayMeals          = meals.filter((m) => m.date === today);
  const todayCalories       = todayMeals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
  const todayWorkouts       = workouts.filter((w) => w.date === today);
  const todayWorkoutMinutes = todayWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);

  // Weekly average calories
  const weekMeals          = meals.filter((m) => m.date >= weekStart);
  const weekDays           = new Set(weekMeals.map((m) => m.date)).size || 1;
  const weekTotalCalories  = weekMeals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
  const weeklyAvgCalories  = Math.round(weekTotalCalories / weekDays);

  // Show skeletons while loading
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Skeleton style={{ height: 160 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[1,2,3,4].map((i) => <Skeleton key={i} style={{ height: 110 }} />)}
        </div>
        <Skeleton style={{ height: 200 }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          {format(new Date(), "EEEE, MMMM d")}
        </p>
      </div>

      {/* The big streak hero card */}
      <StreakCounter streak={streak} />

      {/* 2x2 stat cards */}
      <QuickStats
        todayCalories={todayCalories}
        todayWorkoutMinutes={todayWorkoutMinutes}
        totalMeals={todayMeals.length}
        weeklyAvgCalories={weeklyAvgCalories}
      />

      {/* Breakfast / Lunch / Dinner / Workout checklist */}
      <DailyProgress completedTasks={completedTasks} />
    </div>
  );
}
