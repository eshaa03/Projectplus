import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";  // Your existing one ✅
import { SearchProvider } from "./context/SearchContext";  // Your existing one ✅
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Import toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return (
    <UserProvider>           {/* ✅ Your existing UserProvider */}
      <SearchProvider>       {/* ✅ Your existing SearchProvider */}
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

          {/* ✅ Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
            theme="colored"
          />
        </BrowserRouter>
      </SearchProvider>
    </UserProvider>
  );
}

export default App;
