import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { attendancePercentage, requiredClassesToRecover, safeMissCount } from "../lib/attendance";

export function AttendanceCalculator() {
  const [values, setValues] = useState({ total: 40, attended: 32, minimum: 75 });
  const result = useMemo(() => {
    const total = Number(values.total);
    const attended = Number(values.attended);
    const minimum = Number(values.minimum);
    return {
      percentage: attendancePercentage(attended, total),
      safeMisses: safeMissCount(attended, total, minimum),
      required: requiredClassesToRecover(attended, total, minimum),
    };
  }, [values]);

  return (
    <PageShell eyebrow="Calculator" title="Attendance calculator" description="Test what happens before you miss a class or plan a recovery streak.">
      <section className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="tech-card rounded-3xl p-5">
          <div className="relative">
          {[
            ["total", "Total classes conducted"],
            ["attended", "Attended classes"],
            ["minimum", "Minimum criteria"],
          ].map(([key, label]) => (
            <label key={key} className="mb-4 grid gap-2 text-sm font-bold text-slate-500">
              {label}
              <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white" type="number" value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
            </label>
          ))}
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="scan-line rounded-3xl bg-brand-600 p-6 text-white shadow-soft">
            <span className="text-sm font-bold opacity-80">Current</span>
            <strong className="mt-3 block text-5xl font-black">{result.percentage.toFixed(1)}%</strong>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="tech-card rounded-3xl p-6">
            <span className="relative text-sm font-bold text-slate-500">Can miss</span>
            <strong className="mt-3 block text-5xl font-black">{result.safeMisses}</strong>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="tech-card rounded-3xl p-6">
            <span className="relative text-sm font-bold text-slate-500">Need to attend</span>
            <strong className="mt-3 block text-5xl font-black">{Number.isFinite(result.required) ? result.required : "All"}</strong>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
