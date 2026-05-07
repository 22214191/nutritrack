// =============================================
// ADD MEAL DIALOG
// A slide-up bottom sheet modal for logging a meal.
// Contains fields: meal type, food name, calories, notes.
// Calls onSave() with the form data when submitted.
// =============================================

import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch",     label: "Lunch",     emoji: "☀️" },
  { value: "dinner",    label: "Dinner",    emoji: "🌙" },
  { value: "snack",     label: "Snack",     emoji: "🍎" },
];

// Shared input style to avoid repeating it
const inputStyle = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: 12,
  color: "var(--text)", fontFamily: "var(--font-body)",
  fontSize: 15, padding: "13px 14px", outline: "none",
  boxSizing: "border-box",
};

export default function AddMealDialog({ open, onOpenChange, onSave, date }) {
  // Form state — controlled inputs
  const [mealType,  setMealType]  = useState("breakfast");
  const [foodName,  setFoodName]  = useState("");
  const [calories,  setCalories]  = useState("");
  const [notes,     setNotes]     = useState("");
  const [saving,    setSaving]    = useState(false);

  // Reset the form to empty
  function resetForm() {
    setMealType("breakfast");
    setFoodName("");
    setCalories("");
    setNotes("");
  }

  async function handleSave() {
    if (!foodName.trim()) return; // don't save empty meal
    setSaving(true);
    try {
      await onSave({
        meal_type:      mealType,
        food_name:      foodName.trim(),
        total_calories: calories ? parseInt(calories) : 0,
        notes:          notes.trim() || null,
        date:           format(date, "yyyy-MM-dd"), // e.g. "2026-05-07"
      });
      resetForm();
      onOpenChange(false); // close dialog
    } finally {
      setSaving(false);
    }
  }

  return (
    // AnimatePresence lets us animate the modal out when it closes
    <AnimatePresence>
      {open && (
        <>
          {/* Dark overlay behind the modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.7)", zIndex: 100,
            }}
          />

          {/* Modal panel — slides up from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "var(--surface)", borderRadius: "24px 24px 0 0",
              padding: "24px 20px 48px", zIndex: 101,
              maxWidth: 480, margin: "0 auto",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>
                🥗 Log a Meal
              </h3>
              <button
                onClick={() => onOpenChange(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Meal type selector — row of pill buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {MEAL_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMealType(type.value)}
                  style={{
                    padding: "8px 14px", borderRadius: 999, fontSize: 13,
                    fontWeight: 600, cursor: "pointer", border: "1px solid",
                    borderColor: mealType === type.value ? "var(--accent)" : "var(--border)",
                    background: mealType === type.value ? "var(--accent)" : "var(--surface2)",
                    color: mealType === type.value ? "#0d0d0d" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>

            {/* Food name */}
            <input
              style={inputStyle}
              placeholder="What did you eat? e.g. Chicken & Rice"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
            <div style={{ height: 10 }} />

            {/* Calories */}
            <input
              style={inputStyle}
              type="number"
              placeholder="Calories (optional)"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            <div style={{ height: 10 }} />

            {/* Notes */}
            <textarea
              style={{ ...inputStyle, height: 80, resize: "none" }}
              placeholder="Any notes? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div style={{ height: 14 }} />

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => onOpenChange(false)}
                style={{
                  flex: 1, padding: 14, borderRadius: 12, border: "1px solid var(--border)",
                  background: "var(--surface2)", color: "var(--text)",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !foodName.trim()}
                style={{
                  flex: 1, padding: 14, borderRadius: 12, border: "none",
                  background: foodName.trim() ? "var(--accent)" : "var(--surface2)",
                  color: foodName.trim() ? "#0d0d0d" : "var(--text-muted)",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                  cursor: foodName.trim() ? "pointer" : "default",
                  transition: "all 0.15s",
                }}
              >
                {saving ? "Saving..." : "Log Meal ✓"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
