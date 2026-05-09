import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { TechBackground } from "../components/TechBackground";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      if (isSignup) await signup(form);
      else await login({ email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-50 px-4 py-8 dark:bg-slate-950 lg:grid-cols-[1fr_480px]">
      <TechBackground />
      <section className="relative z-10 hidden items-center px-12 lg:flex">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-3 text-xl font-black text-slate-950 dark:text-white">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white"><GraduationCap /></span>
            Attendly
          </Link>
          <h1 className="mt-12 max-w-2xl text-6xl font-black leading-none text-slate-950 dark:text-white">
            A technical dashboard for every semester.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Your login keeps subjects, logs, exports, GPA plans, and analytics tied to your account.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
            <div className="tech-card rounded-3xl p-5">
              <div className="relative">
                <ShieldCheck className="h-7 w-7 text-brand-600" />
                <strong className="mt-4 block text-xl">JWT protection</strong>
                <p className="mt-2 text-sm text-slate-500">Private student workspace.</p>
              </div>
            </div>
            <div className="tech-card rounded-3xl p-5">
              <div className="relative">
                <LockKeyhole className="h-7 w-7 text-brand-600" />
                <strong className="mt-4 block text-xl">Hashed passwords</strong>
                <p className="mt-2 text-sm text-slate-500">Secure account storage.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 grid place-items-center">
        <motion.form initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} onSubmit={handleSubmit} className="tech-card w-full max-w-md rounded-[2rem] p-6">
          <div className="relative">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-950">
            <button type="button" onClick={() => setMode("login")} className={`rounded-xl py-3 font-black ${!isSignup ? "bg-white shadow dark:bg-slate-800" : "text-slate-500"}`}>Login</button>
            <button type="button" onClick={() => setMode("signup")} className={`rounded-xl py-3 font-black ${isSignup ? "bg-white shadow dark:bg-slate-800" : "text-slate-500"}`}>Signup</button>
          </div>

          <h2 className="mt-8 text-3xl font-black text-slate-950 dark:text-white">{isSignup ? "Create account" : "Welcome back"}</h2>
          <p className="mt-2 text-slate-500">Use your student email to continue.</p>

          <div className="mt-6 grid gap-4">
            {isSignup && (
              <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            )}
            <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600 dark:bg-rose-950">{error}</p>}

          <button className="mt-6 w-full rounded-2xl bg-brand-600 px-5 py-4 font-black text-white">
            {isSignup ? "Create Account" : "Login"}
          </button>
          </div>
        </motion.form>
      </section>
    </main>
  );
}
