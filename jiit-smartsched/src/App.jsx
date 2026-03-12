import { useState } from "react";
import LandingPage   from "./pages/LandingPage";
import LoginPage     from "./pages/LoginPage";
import AdminPortal   from "./pages/AdminPortal";
import StudentPortal from "./pages/StudentPortal";

export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);

  if (view === "landing")
    return <LandingPage onGetStarted={() => setView("login")} />;

  if (view === "login" && !user)
    return <LoginPage onLogin={(u) => { setUser(u); setView("app"); }} />;

  if (user?.role === "admin")
    return <AdminPortal user={user} onLogout={() => { setUser(null); setView("landing"); }} />;

  return <StudentPortal user={user} onLogout={() => { setUser(null); setView("landing"); }} />;
}