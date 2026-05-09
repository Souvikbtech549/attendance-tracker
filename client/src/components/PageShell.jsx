import { motion } from "framer-motion";

export function PageShell({ eyebrow, title, description, children, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-sm font-black uppercase tracking-wide text-brand-600">{eyebrow}</p>}
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
