import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell } from "../components/PageShell";
import { useSubjects } from "../hooks/useSubjects";

export function Analytics() {
  const { subjects } = useSubjects();

  return (
    <PageShell eyebrow="Analytics" title="Attendance analytics" description="Compare subjects visually and identify the attendance risks fastest.">
      <section className="tech-card mt-6 rounded-3xl p-5">
        <h2 className="relative text-xl font-black">Subject-wise attendance</h2>
        <div className="relative mt-6 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </PageShell>
  );
}
