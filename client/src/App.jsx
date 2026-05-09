import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Analytics } from "./pages/Analytics";
import { AttendanceCalculator } from "./pages/AttendanceCalculator";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import { ProfileSettings } from "./pages/ProfileSettings";
import { Timetable } from "./pages/Routine";
import { SubjectManagement } from "./pages/SubjectManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<SubjectManagement />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/routine" element={<Navigate to="/timetable" replace />} />
          <Route path="/calculator" element={<AttendanceCalculator />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
