import { useState } from "react";
import LoginPage     from "./pages/LoginPage";
import AdminPortal   from "./pages/AdminPortal";
import StudentPortal from "./pages/StudentPortal";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user)
    return <LoginPage onLogin={setUser} />;

  if (user.role === "admin")
    return <AdminPortal user={user} onLogout={() => setUser(null)} />;

  return <StudentPortal user={user} onLogout={() => setUser(null)} />;
}
