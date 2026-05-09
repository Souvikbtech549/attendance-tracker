import { AlertTriangle, BookOpen, CalendarCheck, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { StatCard } from "../components/StatCard";
import { SubjectCard } from "../components/SubjectCard";
import { useSubjects } from "../hooks/useSubjects";

export function Dashboard() {
  const { subjects, summary, markAttendance, deleteSubject } = useSubjects();

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Attendance command center"
      description="A live semester view with warning signals, attendance health, and quick class updates."
    >
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="scan-line relative mt-6 overflow-hidden rounded-[2rem] bg-slate-950 p-5 text-white shadow-soft">
        <div className="relative grid gap-5 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-brand-300">Overall signal</p>
            <strong className="mt-3 block text-6xl font-black">{summary.overall.toFixed(1)}%</strong>
            <p className="mt-2 max-w-xl text-slate-400">Keep your subjects above minimum criteria and plan misses with recovery math.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Subjects", summary.count],
              ["Classes", summary.totalClasses],
              ["Alerts", summary.warnings],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
                <strong className="block text-2xl font-black">{value}</strong>
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Subjects" value={summary.count} helper="Active semester subjects" icon={BookOpen} />
        <StatCard label="Total Classes" value={summary.totalClasses} helper="Conducted so far" icon={CalendarCheck} />
        <StatCard label="Overall" value={`${summary.overall.toFixed(1)}%`} helper="Across all subjects" icon={Percent} />
        <StatCard label="Warnings" value={summary.warnings} helper="Below or close to minimum" icon={AlertTriangle} />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-2">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject._id}
            subject={subject}
            onAttend={(id) => markAttendance(id, "attended")}
            onMiss={(id) => markAttendance(id, "missed")}
            onDelete={deleteSubject}
          />
        ))}
        {!subjects.length && <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">Add subjects to start tracking.</div>}
      </section>
    </PageShell>
  );
}
