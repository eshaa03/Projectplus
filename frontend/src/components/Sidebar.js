import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaCog } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <FaProjectDiagram />
        </div>
        <span className="logo-text">Project+</span>
      </div>

      <nav className="nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button inactive"
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button inactive"
          }
        >
          <FaProjectDiagram />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button inactive"
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
