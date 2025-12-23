import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import { Pie } from "react-chartjs-2";
import { UserContext } from "../context/UserContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { token } = useContext(UserContext);

  const [taskData, setTaskData] = useState([0, 0, 0]);
  const [projectData, setProjectData] = useState([0, 0, 0]);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const data = await res.json();

        // TASK DATA
        setTaskData([
          data.tasks?.completed || 0,
          data.tasks?.ongoing || 0,
          data.tasks?.pending || 0,
        ]);

        // PROJECT DATA
        setProjectData([
          data.projects.completed || 0,
          data.projects.inProgress || 0,
          data.projects.notStarted || 0
        ]);

        setTotalProjects(data.projects?.total || 0);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setTaskData([0, 0, 0]);
        setProjectData([0, 0, 0]);
        setTotalProjects(0);
      }
    };

    fetchDashboard();
  }, [token]);

  const taskPie = {
    labels: ["Completed", "Ongoing", "Pending"],
    datasets: [
      {
        data: taskData,
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
      },
    ],
  };

  const projectPie = {
    labels: ["Completed", "Ongoing", "Pending"],
    datasets: [
      {
        data: projectData,
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-card">
        <h1>Dashboard Overview</h1>

        {/* INFO CARDS */}
        <div className="cards">
          <div className="card purple">
            <h2>Total Projects</h2>
            <p>{totalProjects}</p>
          </div>
          <div className="card green">
            <h2>Completed Tasks</h2>
            <p>{taskData[0]}</p>
          </div>
          <div className="card blue">
            <h2>Ongoing Tasks</h2>
            <p>{taskData[1]}</p>
          </div>
          <div className="card yellow">
            <h2>Pending Tasks</h2>
            <p>{taskData[2]}</p>
          </div>
        </div>

        {/* PIE CHARTS */}
        <div className="graph-section">
          <div className="graph-box">
            <h3>Tasks Status</h3>
            <Pie data={taskPie} options={pieOptions} />
          </div>

          <div className="graph-box">
            <h3>Projects Status</h3>
            <Pie data={projectPie} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
