// =============================================
// WORKOUTS PAGE
// Same pattern as Meals page but for workouts.
// =============================================

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkoutsByDate, createWorkout, deleteWorkout } from "@/api/firebase";
import { format } from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WorkoutCard     from "@/components/workouts/WorkoutCard";
import AddWorkoutDialog from "@/components/workouts/AddWorkoutDialog";

export default function Workouts() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const queryClient = useQueryClient();

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ["workouts", dateStr],
    queryFn:  () => getWorkoutsByDate(dateStr),
  });

  const createMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts-all"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts-all"] });
    },
  });

  function goDay(offset) {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + offset);
      return next;
    });
  }

  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
  const totalBurned  = workouts.reduce((sum, w) => sum + (w.calories_burned  || 0), 0);

  const btnStyle = {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 10, color: "var(--text)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>Workouts</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {totalMinutes} min · {totalBurned} kcal burned
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 12, border: "none",
            background: "var(--accent)", color: "#0d0d0d",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          <Plus size={15} /> Log Workout
        </button>
      </div>

      {/* Date navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <button style={btnStyle} onClick={() => goDay(-1)}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ textAlign: "center", minWidth: 140 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
            {isToday ? "Today" : format(selectedDate, "EEEE")}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {format(selectedDate, "MMM d, yyyy")}
          </p>
        </div>
        <button style={{ ...btnStyle, opacity: isToday ? 0.3 : 1 }} onClick={() => goDay(1)} disabled={isToday}>
          <ChevronRight size={16} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2].map((i) => (
            <div key={i} style={{
              height: 80, borderRadius: 16, background: "var(--surface2)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : workouts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 40, marginBottom: 10 }}>🏋️</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No workouts logged for this day</p>
          <button
            onClick={() => setDialogOpen(true)}
            style={{
              marginTop: 14, padding: "10px 18px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--surface2)",
              color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Log your first workout
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {workouts.map((workout) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WorkoutCard workout={workout} onDelete={(id) => deleteMutation.mutate(id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddWorkoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={(data) => createMutation.mutateAsync(data)}
        date={selectedDate}
      />
    </div>
  );
}
