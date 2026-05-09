import { useAuth } from "../state/AuthContext";
import { useTheme } from "../state/ThemeContext";
import { api } from "../lib/api";
import { PageShell } from "../components/PageShell";

export function ProfileSettings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function downloadReport(type) {
    const response = await api.get(`/exports/${type}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-report.${type}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <PageShell eyebrow="Account" title="Profile settings" description="Manage account preferences, exports, and theme mode.">
      <section className="tech-card mt-6 max-w-2xl rounded-3xl p-6">
        <div className="relative grid gap-4">
          <div>
            <span className="text-sm font-bold text-slate-500">Name</span>
            <strong className="block text-xl">{user?.name}</strong>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-500">Email</span>
            <strong className="block text-xl">{user?.email}</strong>
          </div>
          <button onClick={toggleTheme} className="rounded-2xl bg-slate-100 px-5 py-3 font-black dark:bg-slate-800">
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => downloadReport("csv")} className="rounded-2xl bg-brand-600 px-5 py-3 font-black text-white">
              Export CSV
            </button>
            <button onClick={() => downloadReport("pdf")} className="rounded-2xl bg-slate-100 px-5 py-3 font-black dark:bg-slate-800">
              Export PDF
            </button>
          </div>
          <button onClick={logout} className="rounded-2xl bg-rose-50 px-5 py-3 font-black text-rose-600 dark:bg-rose-950">
            Logout
          </button>
        </div>
      </section>
    </PageShell>
  );
}
