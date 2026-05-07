// =============================================
// APP LAYOUT
// This wraps every page. It renders the top bar
// and the bottom nav on mobile.
// <Outlet /> is where the current page renders.
// =============================================

import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, Dumbbell, Flame } from "lucide-react";

// Navigation items — path, icon, and label for each tab
const navItems = [
  { path: "/",         icon: LayoutDashboard, label: "Dashboard" },
  { path: "/meals",    icon: UtensilsCrossed, label: "Meals"     },
  { path: "/workouts", icon: Dumbbell,        label: "Workouts"  },
];

export default function AppLayout() {
  // useLocation tells us the current URL path so we can highlight the active tab
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ---- TOP BAR ---- */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(26,26,26,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          padding: "0 16px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--accent)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Flame size={18} color="#0d0d0d" />
            </div>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 18,
              fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px",
            }}>
              NutriTrack
            </span>
          </Link>

          {/* Desktop nav (hidden on mobile via media query) */}
          <nav className="desktop-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 8,
                    fontSize: 14, fontWeight: 500, textDecoration: "none",
                    background: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "#0d0d0d" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ---- PAGE CONTENT ---- */}
      {/* Outlet renders whichever page matches the current URL */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 100px" }}>
        <Outlet />
      </main>

      {/* ---- MOBILE BOTTOM NAV ---- */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3,
                padding: "6px 20px", borderRadius: 10,
                textDecoration: "none",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                transition: "color 0.15s",
              }}
            >
              <item.icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
