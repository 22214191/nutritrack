// =============================================
// QUICK STATS COMPONENT
// 2x2 grid of stat cards shown on the dashboard.
// Shows: calories today, workout minutes,
// total meals, and weekly average calories.
// =============================================

import { motion } from "framer-motion";
import { Flame, Dumbbell, UtensilsCrossed, TrendingUp } from "lucide-react";

export default function QuickStats({ todayCalories, todayWorkoutMinutes, totalMeals, weeklyAvgCalories }) {
  // Each stat card's data — label, value, icon, and color
  const stats = [
    {
      label: "Today's Calories",
      value: todayCalories.toLocaleString(),
      unit:  "kcal",
      icon:  Flame,
      color: "#f97316", // orange
    },
    {
      label: "Workout Today",
      value: todayWorkoutMinutes,
      unit:  "min",
      icon:  Dumbbell,
      color: "#22c55e", // green
    },
    {
      label: "Meals Today",
      value: totalMeals,
      unit:  "",
      icon:  UtensilsCrossed,
      color: "#3b82f6", // blue
    },
    {
      label: "Weekly Avg",
      value: weeklyAvgCalories.toLocaleString(),
      unit:  "kcal",
      icon:  TrendingUp,
      color: "#a855f7", // purple
    },
  ];

  return (
    // CSS grid with 2 columns
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          {/* Icon badge */}
          <div style={{
            width: 32, height: 32, borderRadius: 8, marginBottom: 12,
            background: stat.color + "1a", // color at 10% opacity
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <stat.icon size={16} color={stat.color} />
          </div>

          {/* Value + unit */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 24, fontWeight: 800, color: "var(--text)",
            }}>
              {stat.value}
            </span>
            {stat.unit && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{stat.unit}</span>
            )}
          </div>

          {/* Label */}
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
