// =============================================
// MEALS PAGE
// Shows logged meals for a selected date.
// You can navigate between days and add/delete meals.
// =============================================

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMealsByDate, createMeal, deleteMeal } from "@/api/firebase";
import { format } from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MealCard     from "@/components/meals/MealCard";
import AddMealDialog from "@/components/meals/AddMealDialog";

export default function Meals() {
  // Which date the user is viewing
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen,   setDialogOpen]   = useState(false);

  // queryClient lets us manually invalidate (clear) cached data
  // so the list refreshes after adding or deleting
  const queryClient = useQueryClient();

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

  // Fetch meals for the selected date
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", dateStr], // changes when dateStr changes → re-fetches
    queryFn:  () => getMealsByDate(dateStr),
  });

  // Mutation for adding a meal
  // After success, invalidate both caches so dashboard + this page refresh
  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meals-all"] });
    },
  });

  // Mutation for deleting a meal
  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["meals-all"] });
    },
  });

  // Navigate between days
  function goDay(offset) {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + offset);
      return next;
    });
  }

  // Sort meals in breakfast → lunch → dinner → snack order
  const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
  const sortedMeals = [...meals].sort(
    (a, b) => (mealOrder[a.meal_type] ?? 4) - (mealOrder[b.meal_type] ?? 4)
  );

  const totalCalories = meals.reduce((sum, m) => sum + (m.total_calories || 0), 0);

  const btnStyle = {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 10, color: "var(--text)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>Meals</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {totalCalories.toLocaleString()} kcal total
          </p>
        </div>
        {/* Log Meal button */}
        <button
          onClick={() => setDialogOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 12, border: "none",
            background: "var(--accent)", color: "#0d0d0d",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          <Plus size={15} /> Log Meal
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

      {/* Content area */}
      {isLoading ? (
        // Loading skeletons
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{
              height: 80, borderRadius: 16, background: "var(--surface2)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : sortedMeals.length === 0 ? (
        // Empty state
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 40, marginBottom: 10 }}>🍽️</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No meals logged for this day</p>
          <button
            onClick={() => setDialogOpen(true)}
            style={{
              marginTop: 14, padding: "10px 18px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--surface2)",
              color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Log your first meal
          </button>
        </div>
      ) : (
        // Meal list with enter/exit animations
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {sortedMeals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MealCard meal={meal} onDelete={(id) => deleteMutation.mutate(id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add meal dialog/modal */}
      <AddMealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={(data) => createMutation.mutateAsync(data)}
        date={selectedDate}
      />
    </div>
  );
}
