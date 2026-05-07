// =============================================
// STREAK COUNTER COMPONENT
// The big hero card at the top of the dashboard.
// Shows the streak number, a motivational message,
// and a progress bar toward the next milestone.
// =============================================

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

// Milestone targets — these are the goals we track progress toward
const milestones = [3, 7, 14, 30, 60, 100];

// Returns the right message and emoji based on current streak length
function getMilestoneMessage(streak) {
  if (streak === 0) return { msg: "Log a meal + workout today to ignite your streak!", emoji: "💤" };
  if (streak === 1) return { msg: "You started! Come back tomorrow to keep it going.",  emoji: "🌱" };
  if (streak < 3)   return { msg: "Nice start — build the habit!",                       emoji: "🔥" };
  if (streak < 7)   return { msg: "3-day streak unlocked! Keep pushing.",                emoji: "🔥" };
  if (streak < 14)  return { msg: "One week strong! You're building real consistency.",  emoji: "💪" };
  if (streak < 30)  return { msg: "Two weeks in — this is a lifestyle now!",             emoji: "⚡" };
  if (streak < 60)  return { msg: "30-day warrior! Absolute dedication.",                emoji: "🏆" };
  return              { msg: "LEGENDARY. You are unstoppable.",                           emoji: "👑" };
}

// Finds the next milestone above the current streak
function getNextMilestone(streak) {
  return milestones.find((m) => m > streak) ?? null;
}

export default function StreakCounter({ streak }) {
  const { msg, emoji }  = getMilestoneMessage(streak);
  const nextMilestone   = getNextMilestone(streak);
  const daysLeft        = nextMilestone ? nextMilestone - streak : 0;

  // How far along are we to the next milestone? (as a percentage)
  const prevMilestone   = milestones.filter((m) => m <= streak).pop() ?? 0;
  const progress        = nextMilestone
    ? Math.round(((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
    : 100;

  const isActive = streak > 0;

  return (
    // motion.div animates in when component first mounts
    <motion.div
      initial={{ scale: 0.93, opacity: 0 }}
      animate={{ scale: 1,    opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "24px",
        background: isActive
          ? "linear-gradient(135deg, #f97316, #ef4444, #e11d48)"
          : "linear-gradient(135deg, #1a1a1a, #242424)",
        color: isActive ? "white" : "var(--text-muted)",
      }}
    >
      {/* Animated background flame decorations (only when streak is active) */}
      {isActive && (
        <>
          <motion.div
            style={{ position: "absolute", right: -20, top: -20, opacity: 0.12 }}
            animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.05, 0.98, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame size={160} />
          </motion.div>
          <motion.div
            style={{ position: "absolute", left: -16, bottom: -20, opacity: 0.08 }}
            animate={{ rotate: [0, -6, 4, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Flame size={120} />
          </motion.div>
        </>
      )}

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* Label row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Flame size={14} color={isActive ? "#fde68a" : "#666"} />
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: isActive ? "rgba(255,255,255,0.75)" : "#666",
          }}>
            Daily Streak
          </span>
        </div>

        {/* Big streak number */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 8 }}>
          <motion.span
            key={streak} // re-animates when streak changes
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: streak >= 100 ? "4.5rem" : "5.5rem",
              lineHeight: 1,
              color: isActive ? "white" : "var(--text-muted)",
            }}
          >
            {streak}
          </motion.span>
          <span style={{
            fontSize: 20, fontWeight: 600, marginBottom: 8,
            color: isActive ? "rgba(255,255,255,0.7)" : "#555",
          }}>
            {streak === 1 ? "day" : "days"}
          </span>
          {isActive && <span style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</span>}
        </div>

        {/* Motivational message */}
        <p style={{
          fontSize: 13, fontWeight: 500, marginBottom: 16,
          color: isActive ? "rgba(255,255,255,0.75)" : "#666",
        }}>
          {msg}
        </p>

        {/* Progress bar to next milestone */}
        {nextMilestone && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.6)" : "#555" }}>
                Next: {nextMilestone} days
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "rgba(255,255,255,0.8)" : "#666" }}>
                {daysLeft} to go
              </span>
            </div>
            {/* Track */}
            <div style={{
              height: 6, borderRadius: 999, overflow: "hidden",
              background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
            }}>
              {/* Animated fill */}
              <motion.div
                style={{
                  height: "100%", borderRadius: 999,
                  background: isActive ? "#fde68a" : "#444",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, progress)}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* When streak is 0, show the two "not done" tags */}
        {streak === 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["Meal logged ✗", "Workout done ✗"].map((tag) => (
              <span key={tag} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 999,
                background: "rgba(255,255,255,0.05)", color: "#666", fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
