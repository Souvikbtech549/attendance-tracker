import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Trash2 } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { useRoutine, days } from "../hooks/useRoutine";
import { useSubjects } from "../hooks/useSubjects";

const initialForm = {
  subject: "",
  dayOfWeek: new Date().getDay(),
  startTime: "09:00",
  endTime: "10:00",
  room: "",
};

export function Timetable() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { subjects } = useSubjects();
  const { groupedEntries, todayEntries, addEntry, deleteEntry, loading } = useRoutine();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.subject) {
      setError("Add a subject first, then choose it for the timetable.");
      return;
    }

    try {
      await addEntry({
        ...form,
        dayOfWeek: Number(form.dayOfWeek),
      });
      setForm({ ...initialForm, subject: form.subject });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <PageShell
      eyebrow="Everyday classes"
      title="Class timetable"
      description="Build your weekly timetable and keep daily classes connected with your attendance subjects."
    >

      <section className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]">
        <motion.form initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="tech-card rounded-3xl p-5">
          <div className="relative">
          <h2 className="text-xl font-black">Add class</h2>

          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-500">
            Subject
            <select
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </label>

          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-500">
            Day
            <select
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white"
              value={form.dayOfWeek}
              onChange={(event) => setForm({ ...form, dayOfWeek: event.target.value })}
            >
              {days.map((day, index) => (
                <option key={day} value={index}>{day}</option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-bold text-slate-500">
              Start
              <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white" type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-500">
              End
              <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white" type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-500">
            Room
            <input className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-slate-950 dark:border-slate-700 dark:text-white" placeholder="Room 204 / Lab A" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} />
          </label>

          {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600 dark:bg-rose-950">{error}</p>}

          <button className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-4 font-black text-white">Add to timetable</button>
          </div>
        </motion.form>

        <div className="grid gap-5">
          <section className="tech-card rounded-3xl p-5">
            <div className="relative flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-brand-600" />
              <h2 className="text-xl font-black">Today</h2>
            </div>
            <div className="relative mt-4 grid gap-3 md:grid-cols-2">
              {todayEntries.map((entry) => (
                <RoutineEntry key={entry._id} entry={entry} onDelete={deleteEntry} />
              ))}
              {!todayEntries.length && <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-slate-500 dark:border-slate-700">No classes scheduled today.</p>}
            </div>
          </section>

          <section className="grid gap-4">
            {groupedEntries.map((group) => (
              <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} key={group.day} className="tech-card rounded-3xl p-5">
                <div className="relative flex items-center justify-between">
                  <h2 className="text-lg font-black">{group.day}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500 dark:bg-slate-800">{group.entries.length} classes</span>
                </div>
                <div className="relative mt-4 grid gap-3 md:grid-cols-2">
                  {group.entries.map((entry) => (
                    <RoutineEntry key={entry._id} entry={entry} onDelete={deleteEntry} />
                  ))}
                  {!group.entries.length && !loading && <p className="text-sm text-slate-500">No timetable added.</p>}
                </div>
              </motion.article>
            ))}
          </section>
        </div>
      </section>
    </PageShell>
  );
}

function RoutineEntry({ entry, onDelete }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{entry.subject?.name || "Subject"}</h3>
          <p className="mt-1 text-sm text-slate-500">{entry.subject?.code || entry.subject?.semester?.name || "Class"}</p>
        </div>
        <button onClick={() => onDelete(entry._id)} className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{entry.startTime} - {entry.endTime}</span>
        {entry.room && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{entry.room}</span>}
      </div>
    </div>
  );
}
