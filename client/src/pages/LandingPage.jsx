import { motion } from "framer-motion";
import { ArrowRight, BellRing, BarChart3, Binary, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { TechBackground } from "../components/TechBackground";

const features = [
  { icon: BarChart3, title: "Subject analytics", text: "See percentage, warnings, recovery count, and safe bunk count instantly." },
  { icon: BellRing, title: "Smart warnings", text: "Know before your attendance slips below your college criteria." },
  { icon: ShieldCheck, title: "Private accounts", text: "JWT protected student data with semester-wise storage." },
];

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <TechBackground />
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-black uppercase tracking-wide text-brand-600">
            Student Attendance Platform
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 max-w-3xl text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
            Attendance control, visualized like a cockpit.
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Track subjects, calculate safe misses, recover low attendance, manage semesters, and visualize performance from any device.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-700">
              Start Tracking <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#features" className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200">
              View Features
            </a>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.12 }} className="tech-card scan-line relative rounded-[2rem] p-4">
          <div className="relative rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wide text-brand-300">Live Semester Matrix</span>
                <strong className="mt-2 block text-5xl font-black">82%</strong>
                <p className="mt-1 text-sm text-slate-400">Overall attendance</p>
              </div>
              <motion.div animate={{ rotate: [0, 4, 0], scale: [1, 1.04, 1] }} transition={{ duration: 5, repeat: Infinity }} className="grid h-24 w-24 place-items-center rounded-3xl border border-brand-400/30 bg-brand-500/10">
                <Binary className="h-11 w-11 text-brand-300" />
              </motion.div>
            </div>

            <div className="mt-8 grid gap-3">
              {["Data Structures", "Mathematics", "Operating Systems"].map((name, index) => (
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.08 }} key={name} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <strong>{[88, 79, 71][index]}%</strong>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="pulse-bar h-2 rounded-full bg-brand-400" style={{ width: `${[88, 79, 71][index]}%`, animationDelay: `${index * 0.3}s` }} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ["12", "Safe misses"],
                ["03", "Warnings"],
                ["06", "Today"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <strong className="block text-2xl font-black">{value}</strong>
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map(({ icon: Icon, title, text }, index) => (
          <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} key={title} className="tech-card rounded-3xl p-6">
            <div className="relative">
            <Icon className="h-8 w-8 text-brand-600" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
