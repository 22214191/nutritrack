// =============================================
// DAILY PROGRESS COMPONENT
// Shows a checklist of today's 4 tasks:
// Breakfast, Lunch, Dinner, Workout
// with a progress bar showing % complete.
// =============================================

import { Check } from "lucide-react";
import { motion } from "framer-motion";

// The 4 tasks we track each day
// key must match what getTodayCompletedTasks() returns
const TASKS = [
  { key: "breakfast", label: "Breakfast", emoji: "🌅" },
  { key: "lunch",     label: "Lunch",     emoji: "☀️" },
  { key: "dinner",    label: "Dinner",    emoji: "🌙" },
  { key: "workout",   label: "Workout",   emoji: "💪" },
];

export default function DailyProgress({ completedTasks }) {
  // Count how many tasks are done
  const completedCount = TASKS.filter((t) => completedTasks.includes(t.key)).length;
  const percentage = Math.round((completedCount / TASKS.length) * 100);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 24,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 16,
          fontWeight: 700, color: "var(--text)",
        }}>
          Today's Checklist
        </h3>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, background: "var(--surface2)",
        borderRadius: 999, overflow: "hidden", marginBottom: 20,
      }}>
        <motion.div
          style={{ height: "100%", background: "var(--accent)", borderRadius: 999 }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TASKS.map((task, i) => {
          const done = completedTasks.includes(task.key);
          return (
            <motion.div
              key={task.key}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              {/* Checkbox circle */}
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: done ? "var(--accent)" : "transparent",
                border: done ? "none" : "2px solid var(--border)",
                transition: "all 0.2s",
              }}>
                {done && <Check size={13} color="#0d0d0d" strokeWidth={3} />}
              </div>

              {/* Emoji + label */}
              <span style={{ fontSize: 16 }}>{task.emoji}</span>
              <span style={{
                fontSize: 14, fontWeight: 500,
                color: done ? "var(--text)" : "var(--text-muted)",
                textDecoration: done ? "none" : "none",
              }}>
                {task.label}
              </span>

              {/* Done badge */}
              {done && (
                <span style={{
                  marginLeft: "auto", fontSize: 11,
                  color: "var(--accent)", fontWeight: 700,
                }}>
                  Done ✓
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
