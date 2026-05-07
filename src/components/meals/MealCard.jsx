// =============================================
// MEAL CARD COMPONENT
// Displays a single logged meal entry.
// Shows meal type, food name, calories, and
// a delete button.
// =============================================

import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Emoji and color for each meal type
const MEAL_META = {
  breakfast: { emoji: "🌅", color: "#f97316", label: "Breakfast" },
  lunch:     { emoji: "☀️", color: "#eab308", label: "Lunch"     },
  dinner:    { emoji: "🌙", color: "#6366f1", label: "Dinner"    },
  snack:     { emoji: "🍎", color: "#22c55e", label: "Snack"     },
};

export default function MealCard({ meal, onDelete }) {
  const meta = MEAL_META[meal.meal_type] || { emoji: "🍽️", color: "#888", label: meal.meal_type };

  return (
    <motion.div
      layout
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Meal type badge */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: meta.color + "1a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        {meta.emoji}
      </div>

      {/* Meal info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: meta.color,
          }}>
            {meta.label}
          </span>
        </div>
        {/* Food name — truncated if too long */}
        <p style={{
          fontSize: 15, fontWeight: 600, color: "var(--text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {meal.food_name}
        </p>
        {/* Optional notes */}
        {meal.notes && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {meal.notes}
          </p>
        )}
      </div>

      {/* Calories badge */}
      {meal.total_calories > 0 && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 17, fontWeight: 800, color: "var(--text)",
          }}>
            {meal.total_calories}
          </span>
          <p style={{ fontSize: 10, color: "var(--text-muted)" }}>kcal</p>
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(meal.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 6, borderRadius: 8, color: "var(--text-muted)",
          flexShrink: 0,
        }}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}
