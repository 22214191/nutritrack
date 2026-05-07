// =============================================
// WORKOUT CARD COMPONENT
// Displays a single logged workout entry.
// Shows workout type, name, duration, calories burned.
// =============================================

import { Trash2, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";

const WORKOUT_META = {
  strength:   { emoji: "🏋️", color: "#f97316", label: "Strength"   },
  cardio:     { emoji: "🏃", color: "#22c55e", label: "Cardio"     },
  yoga:       { emoji: "🧘", color: "#a855f7", label: "Yoga"       },
  sports:     { emoji: "⚽", color: "#3b82f6", label: "Sports"     },
  hiit:       { emoji: "⚡", color: "#ef4444", label: "HIIT"       },
  cycling:    { emoji: "🚴", color: "#06b6d4", label: "Cycling"    },
  swimming:   { emoji: "🏊", color: "#0ea5e9", label: "Swimming"   },
  other:      { emoji: "💪", color: "#888",    label: "Workout"    },
};

export default function WorkoutCard({ workout, onDelete }) {
  const meta = WORKOUT_META[workout.workout_type] || WORKOUT_META.other;

  return (
    <motion.div
      layout
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16, padding: 16,
        display: "flex", alignItems: "center", gap: 14,
      }}
    >
      {/* Type badge */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: meta.color + "1a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>
        {meta.emoji}
      </div>

      {/* Workout info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.08em", color: meta.color,
        }}>
          {meta.label}
        </span>
        <p style={{
          fontSize: 15, fontWeight: 600, color: "var(--text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {workout.workout_name}
        </p>
        {/* Duration + calories burned */}
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          {workout.duration_minutes > 0 && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={11} /> {workout.duration_minutes} min
            </span>
          )}
          {workout.calories_burned > 0 && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
              <Flame size={11} /> {workout.calories_burned} kcal
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(workout.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 6, borderRadius: 8, color: "var(--text-muted)", flexShrink: 0,
        }}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}
