// =============================================
// ADD WORKOUT DIALOG
// Slide-up modal for logging a workout.
// Fields: workout type, name, duration, calories burned, notes.
// =============================================

import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WORKOUT_TYPES = [
  { value: "strength", label: "Strength", emoji: "🏋️" },
  { value: "cardio",   label: "Cardio",   emoji: "🏃" },
  { value: "hiit",     label: "HIIT",     emoji: "⚡" },
  { value: "yoga",     label: "Yoga",     emoji: "🧘" },
  { value: "sports",   label: "Sports",   emoji: "⚽" },
  { value: "cycling",  label: "Cycling",  emoji: "🚴" },
  { value: "swimming", label: "Swimming", emoji: "🏊" },
  { value: "other",    label: "Other",    emoji: "💪" },
];

const inputStyle = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: 12,
  color: "var(--text)", fontFamily: "var(--font-body)",
  fontSize: 15, padding: "13px 14px", outline: "none",
  boxSizing: "border-box",
};

export default function AddWorkoutDialog({ open, onOpenChange, onSave, date }) {
  const [workoutType, setWorkoutType] = useState("strength");
  const [workoutName, setWorkoutName] = useState("");
  const [duration,    setDuration]    = useState("");
  const [burned,      setBurned]      = useState("");
  const [notes,       setNotes]       = useState("");
  const [saving,      setSaving]      = useState(false);

  function resetForm() {
    setWorkoutType("strength");
    setWorkoutName("");
    setDuration("");
    setBurned("");
    setNotes("");
  }

  async function handleSave() {
    if (!workoutName.trim()) return;
    setSaving(true);
    try {
      await onSave({
        workout_type:    workoutType,
        workout_name:    workoutName.trim(),
        duration_minutes: duration ? parseInt(duration) : 0,
        calories_burned:  burned   ? parseInt(burned)   : 0,
        notes:            notes.trim() || null,
        date:             format(date, "yyyy-MM-dd"),
      });
      resetForm();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100 }}
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "var(--surface)", borderRadius: "24px 24px 0 0",
              padding: "24px 20px 48px", zIndex: 101,
              maxWidth: 480, margin: "0 auto",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>
                💪 Log a Workout
              </h3>
              <button
                onClick={() => onOpenChange(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Workout type pills — scrollable row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {WORKOUT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setWorkoutType(type.value)}
                  style={{
                    padding: "8px 12px", borderRadius: 999, fontSize: 12,
                    fontWeight: 600, cursor: "pointer", border: "1px solid",
                    borderColor: workoutType === type.value ? "var(--accent)" : "var(--border)",
                    background: workoutType === type.value ? "var(--accent)" : "var(--surface2)",
                    color: workoutType === type.value ? "#0d0d0d" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {type.emoji} {type.label}
                </button>
              ))}
            </div>

            <input
              style={inputStyle}
              placeholder="Workout name e.g. Chest Day, Morning Run"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <div style={{ height: 10 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                style={inputStyle}
                type="number"
                placeholder="Duration (min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <input
                style={inputStyle}
                type="number"
                placeholder="Kcal burned"
                value={burned}
                onChange={(e) => setBurned(e.target.value)}
              />
            </div>
            <div style={{ height: 10 }} />

            <textarea
              style={{ ...inputStyle, height: 70, resize: "none" }}
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div style={{ height: 14 }} />

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
                disabled={saving || !workoutName.trim()}
                style={{
                  flex: 1, padding: 14, borderRadius: 12, border: "none",
                  background: workoutName.trim() ? "var(--accent)" : "var(--surface2)",
                  color: workoutName.trim() ? "#0d0d0d" : "var(--text-muted)",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                  cursor: workoutName.trim() ? "pointer" : "default",
                  transition: "all 0.15s",
                }}
              >
                {saving ? "Saving..." : "Log Workout ✓"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
