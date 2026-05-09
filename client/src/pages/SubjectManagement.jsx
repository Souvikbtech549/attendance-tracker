import { useState } from "react";
import { motion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { SubjectCard } from "../components/SubjectCard";
import { useSubjects } from "../hooks/useSubjects";

const initialForm = {
  name: "",
  code: "",
  semesterName: "Semester 1",
  totalClasses: 0,
  attendedClasses: 0,
  minimumCriteria: 75,
  credits: 3,
};

export function SubjectManagement() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { subjects, addSubject, markAttendance, deleteSubject } = useSubjects();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Number(form.attendedClasses) > Number(form.totalClasses)) {
      setError("Attended classes cannot be more than total classes.");
      return;
    }

    await addSubject({
      ...form,
      totalClasses: Number(form.totalClasses),
      attendedClasses: Number(form.attendedClasses),
      minimumCriteria: Number(form.minimumCriteria),
      credits: Number(form.credits),
      semester: { name: form.semesterName },
    });
    setForm(initialForm);
  }

  return (
    <PageShell eyebrow="Subjects" title="Subject management" description="Create semester subjects, define criteria, and update attendance from one control surface.">
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="tech-card mt-6 grid gap-4 rounded-3xl p-5 md:grid-cols-3">
        <div className="relative contents">
        {[
          ["name", "Subject name"],
          ["code", "Subject code"],
          ["semesterName", "Semester"],
          ["totalClasses", "Total classes"],
          ["attendedClasses", "Attended classes"],
          ["minimumCriteria", "Minimum criteria"],
          ["credits", "Credits"],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2 text-sm font-bold text-slate-500">
            {label}
            <input
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white"
              type={["totalClasses", "attendedClasses", "minimumCriteria", "credits"].includes(key) ? "number" : "text"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key !== "code"}
            />
          </label>
        ))}
        <button className="rounded-2xl bg-brand-600 px-5 py-3 font-black text-white md:self-end">Add Subject</button>
        {error && <p className="md:col-span-3 rounded-2xl bg-rose-50 p-3 font-bold text-rose-600 dark:bg-rose-950">{error}</p>}
        </div>
      </motion.form>

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
      </section>
    </PageShell>
  );
}
