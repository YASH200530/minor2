import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage   from "./pages/LandingPage";
import LoginPage     from "./pages/LoginPage";
import AdminPortal   from "./pages/AdminPortal";
import StudentPortal from "./pages/StudentPortal";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={() => {}} />} />
        
        <Route path="/login" element={
          user ? <Navigate to={user.role === "admin" ? "/admin" : "/student"} /> : <LoginPage onLogin={handleLogin} />
        } />

        <Route 
          path="/admin" 
          element={
            user?.role === "admin" ? <AdminPortal user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/student" 
          element={
            user?.role === "student" ? <StudentPortal user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}