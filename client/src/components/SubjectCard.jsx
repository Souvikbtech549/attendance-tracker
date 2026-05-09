import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { CircularProgress } from "./CircularProgress";

const statusStyles = {
  safe: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export function SubjectCard({ subject, onAttend, onMiss, onDelete }) {
  const warningText = subject.status === "safe"
    ? `${subject.safeMisses} classes can be missed`
    : `${subject.requiredClasses} classes needed to recover`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="tech-card rounded-3xl p-5"
    >
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[subject.status]}`}>
            {subject.status === "safe" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {subject.status === "safe" ? "Safe" : "Needs attention"}
          </div>
          <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{subject.name}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subject.semester?.name || "Current semester"}</p>
        </div>
        <CircularProgress value={subject.percentage} />
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
          <span className="text-slate-500">Total</span>
          <strong className="block text-lg">{subject.totalClasses}</strong>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
          <span className="text-slate-500">Attended</span>
          <strong className="block text-lg">{subject.attendedClasses}</strong>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
          <span className="text-slate-500">Minimum</span>
          <strong className="block text-lg">{subject.minimumCriteria}%</strong>
        </div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-brand-500/20 bg-brand-50/90 p-3 text-sm font-semibold text-brand-700 dark:bg-slate-950/90 dark:text-brand-50">
        {warningText}
      </div>

      <div className="relative mt-4 grid grid-cols-[1fr_1fr_auto] gap-2">
        <button onClick={() => onAttend(subject._id)} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700">Attended</button>
        <button onClick={() => onMiss(subject._id)} className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-slate-700">Missed</button>
        <button onClick={() => onDelete(subject._id)} className="rounded-2xl bg-rose-50 px-3 text-rose-600 transition hover:-translate-y-0.5 dark:bg-rose-950">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </motion.article>
  );
}
