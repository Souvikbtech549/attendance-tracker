import { motion } from "framer-motion";

export function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="tech-card rounded-3xl p-5"
    >
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</strong>
        </div>
        {Icon && <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-500/20 bg-brand-500/10"><Icon className="h-7 w-7 text-brand-500" /></span>}
      </div>
      {helper && <p className="relative mt-3 text-sm text-slate-500 dark:text-slate-400">{helper}</p>}
    </motion.article>
  );
}
