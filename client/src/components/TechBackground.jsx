import { motion } from "framer-motion";

export function TechBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="tech-grid absolute inset-0 opacity-70" />
      <motion.div
        animate={{ x: ["-20%", "15%", "-8%"], y: ["0%", "8%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-12%] top-12 h-[420px] w-[420px] rotate-12 border border-brand-500/20"
      />
      <motion.div
        animate={{ x: ["8%", "-12%", "8%"], rotate: [0, 2, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-[-10%] h-56 w-[520px] -skew-x-12 border-y border-brand-500/15"
      />
      <div className="circuit-lines absolute inset-x-0 top-0 h-64 opacity-60" />
    </div>
  );
}
