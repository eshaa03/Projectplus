import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProjectsPage.css";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch projects and tasks
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      // Fetch tasks for each project
      const projectsWithStatus = await Promise.all(
        data.map(async (proj) => {
          const taskRes = await fetch(`http://localhost:5000/api/tasks?projectId=${proj._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const tasks = await taskRes.json();

          // Calculate project status
          let status = "Pending";
          if (tasks.length > 0) {
            const allCompleted = tasks.every((t) => t.status.toLowerCase() === "completed");
            const allPending = tasks.every((t) => t.status.toLowerCase() === "pending");
            status = allCompleted ? "Completed" : allPending ? "Pending" : "Ongoing";
          }


          return { ...proj, status };
        })
      );

      setProjects(projectsWithStatus);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProject.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newProject }),
      });
      await res.json();
      setNewProject("");
      fetchProjects(); // Refresh project list
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const startEditing = (project) => {
    setEditId(project._id);
    setEditName(project.name);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editName }),
      });
      setEditId(null);
      setEditName("");
      fetchProjects();
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };
  const getStatusColor = (status) => {
  if (status === "Completed") return "#10B981"; // Green
  if (status === "Ongoing") return "#F59E0B";   // Yellow/Orange
  if (status === "Pending") return "#EF4444";   // Red
  return "#6B7280"; // Default Gray
};


  return (
    <div className="projects-page">
      <div className="projects-card">
        <h2 className="projects-title">Projects</h2>

        {/* Add Project */}
        <div className="add-project">
          <input
            type="text"
            placeholder="New project name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button onClick={addProject}>Add Project</button>
        </div>

        {/* List Projects */}
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              {editId === project._id ? (
                <>
                  <input
                    className="edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <button onClick={() => saveEdit(project._id)}>Save</button>
                </>
              ) : (
                <>
                  <h3>{project.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(project.status),
                        fontWeight: "bold"
                      }}
                    >
                    {project.status}
                    </span>
                  </p>

                </>
              )}

              <p className="timestamp">
                <strong>Created:</strong>{" "}
                {new Date(project.createdAt).toLocaleString()}
              </p>
              

              <div className="project-actions">
                <Link to={`/tasks?projectId=${project._id}&projectName=${encodeURIComponent(project.name)}`}>
                <button>View Tasks</button>
                </Link>

                <button onClick={() => startEditing(project)}>Edit</button>
                <button onClick={() => deleteProject(project._id)}>Delete</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="no-task">No projects yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
