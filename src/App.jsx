// =============================================
// APP.JSX — ROOT OF THE APP
// This is the entry point React renders first.
// It sets up three things that wrap the whole app:
//   1. QueryClientProvider — enables React Query caching
//   2. BrowserRouter — enables URL-based navigation
//   3. Routes — maps URLs to page components
// =============================================

import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { queryClientInstance } from "@/lib/queryClient";

import AppLayout  from "@/components/layout/AppLayout";
import Dashboard  from "@/pages/Dashboard";
import Meals      from "@/pages/Meals";
import Workouts   from "@/pages/Workouts";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/meals"    element={<Meals />}     />
            <Route path="/workouts" element={<Workouts />}  />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
