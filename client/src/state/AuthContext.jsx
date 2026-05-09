import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem("attendance_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("attendance_token");
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("attendance_token", data.token);
    setUser(data.user);
  }

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("attendance_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("attendance_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
