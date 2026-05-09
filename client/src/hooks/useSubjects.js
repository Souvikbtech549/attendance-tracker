import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { enrichSubject } from "../lib/attendance";

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSubjects() {
    setLoading(true);
    const { data } = await api.get("/subjects");
    setSubjects(data.subjects.map(enrichSubject));
    setLoading(false);
  }

  async function addSubject(payload) {
    await api.post("/subjects", payload);
    await loadSubjects();
  }

  async function updateSubject(id, payload) {
    await api.put(`/subjects/${id}`, payload);
    await loadSubjects();
  }

  async function deleteSubject(id) {
    await api.delete(`/subjects/${id}`);
    await loadSubjects();
  }

  async function markAttendance(id, status) {
    await api.post(`/subjects/${id}/logs`, { status });
    await loadSubjects();
  }

  useEffect(() => {
    loadSubjects();

    const interval = window.setInterval(() => {
      loadSubjects();
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const summary = useMemo(() => {
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const attendedClasses = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    const overall = totalClasses ? (attendedClasses / totalClasses) * 100 : 0;
    const warnings = subjects.filter((subject) => subject.status !== "safe").length;

    return { totalClasses, attendedClasses, overall, warnings, count: subjects.length };
  }, [subjects]);

  return {
    subjects,
    loading,
    summary,
    addSubject,
    updateSubject,
    deleteSubject,
    markAttendance,
    reload: loadSubjects,
  };
}
