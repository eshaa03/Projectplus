import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function ProtectedLayoutWrapper() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ FIX: restore user on page refresh
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();

            if (
              data.avatar &&
              !data.avatar.startsWith("http") &&
              !data.avatar.startsWith("data:")
            ) {
              data.avatar = `data:image/png;base64,${data.avatar}`;
            }

            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    };

    fetchUser();
  }, [token, user]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayoutWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<AddTask />} />
            <Route path="/tasks/edit/:id" element={<EditTask />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
