import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, CalendarDays, Calculator, GraduationCap, Home, LogOut, Moon, Settings, Sun, BookOpen } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { useTheme } from "../state/ThemeContext";
import { TechBackground } from "./TechBackground";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: Settings },
];

export function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <TechBackground />
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-72 border-r border-slate-200/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/25">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <strong className="block text-lg">Attendly</strong>
            <span className="text-sm text-slate-500">{user?.name}</span>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-2">
          <button onClick={toggleTheme} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
            {theme === "dark" ? <Sun className="mx-auto h-5 w-5" /> : <Moon className="mx-auto h-5 w-5" />}
          </button>
          <button onClick={handleLogout} className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-600 dark:bg-rose-950">
            <LogOut className="mx-auto h-5 w-5" />
          </button>
        </div>
      </aside>

      <main className="relative z-10 pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-6 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `grid place-items-center gap-1 rounded-xl py-2 text-xs font-bold ${isActive ? "text-brand-600" : "text-slate-500"}`}>
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
