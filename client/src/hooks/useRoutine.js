import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function useRoutine() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRoutine() {
    setLoading(true);
    const { data } = await api.get("/routine");
    setEntries(data.entries);
    setLoading(false);
  }

  async function addEntry(payload) {
    await api.post("/routine", payload);
    await loadRoutine();
  }

  async function deleteEntry(id) {
    await api.delete(`/routine/${id}`);
    await loadRoutine();
  }

  useEffect(() => {
    loadRoutine();
  }, []);

  const groupedEntries = useMemo(() => {
    return days.map((day, index) => ({
      day,
      dayOfWeek: index,
      entries: entries.filter((entry) => entry.dayOfWeek === index),
    }));
  }, [entries]);

  const todayEntries = useMemo(() => {
    const today = new Date().getDay();
    return entries.filter((entry) => entry.dayOfWeek === today);
  }, [entries]);

  return {
    entries,
    groupedEntries,
    todayEntries,
    loading,
    addEntry,
    deleteEntry,
    reload: loadRoutine,
  };
}
