import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ProjectsPage.css";
import { FiX, FiFilter, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";



function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [openFilter, setOpenFilter] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  // Fetch projects and tasks
  const fetchProjects = useCallback(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();

    const projectsWithTasks = await Promise.all(
      data.map(async (proj) => {
        const taskRes = await fetch(
          `http://localhost:5000/api/tasks?projectId=${proj._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const tasks = await taskRes.json();
        const tasksWithProject = tasks.map((t) => ({
          ...t,
          projectName: proj.name,
        }));

        let status = "Pending";
        if (tasks.length > 0) {
          const allCompleted = tasks.every(
            (t) => t.status.toLowerCase() === "completed"
          );
          const allPending = tasks.every(
            (t) => t.status.toLowerCase() === "pending"
          );
          status = allCompleted
            ? "Completed"
            : allPending
            ? "Pending"
            : "Ongoing";
        }

        return { ...proj, status, tasks: tasksWithProject };
      })
    );

    setProjects(projectsWithTasks);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
}, []);


useEffect(() => {
  fetchProjects();
}, [fetchProjects]);

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
      fetchProjects();
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
    if (status === "Completed") return "#10B981";
    if (status === "Ongoing") return "#F59E0B";
    if (status === "Pending") return "#EF4444";
    return "#6B7280";
  };

  const filteredProjects =
    filterStatus === "ALL"
      ? projects
      : projects.filter((p) => p.status === filterStatus);

  const getEmptyProjectMessage = () => {
  if (filterStatus === "Completed") return "No completed projects.";
  if (filterStatus === "Ongoing") return "No ongoing projects.";
  if (filterStatus === "Pending") return "No pending projects.";
  return "No projects yet.";
};


  return (
    <div className="projects-page">
      <div className="projects-card">
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>

          <div className="filter-wrapper">
            <button
              className="filter-btn"
              title="Filter"
              onClick={() => setOpenFilter(!openFilter)}
            >
              <FiFilter />
            </button>

            {openFilter && (
              <div className="filter-dropdown">
                <button
                  onClick={() => {
                    setFilterStatus("ALL");
                    setOpenFilter(false);
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("Completed");
                    setOpenFilter(false);
                  }}
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("Ongoing");
                    setOpenFilter(false);
                  }}
                >
                  Ongoing
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("Pending");
                    setOpenFilter(false);
                  }}
                >
                  Pending
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Project */}
        <div className="add-project">
          <input
            type="text"
            placeholder="New project name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addProject();
              }
            }}
          />
          <button onClick={addProject}>Add Project</button>
        </div>

        {/* List Projects */}
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <div key={project._id} className="project-card">
              {editId === project._id ? (
                <>
                  <input
                    className="edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div className="edit-buttons">
                    <button
                      className="save-btn"
                      onClick={() => saveEdit(project._id)}
                      title="Save"
                    >
                      <AiOutlineCheck />
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setEditId(null);
                        setEditName("");
                      }}
                      title="Cancel"
                    >
                      <FiX />
                    </button>
                  </div>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(project.status),
                        fontWeight: "bold",
                      }}
                    >
                      {project.status}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <h3>{project.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(project.status),
                        fontWeight: "bold",
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
                <Link
                  to={`/tasks?projectId=${project._id}&projectName=${encodeURIComponent(
                    project.name
                  )}`}
                >
                  <button title="View Tasks">
                    <FiEye />
                  </button>
                </Link>

                <button title="Edit Project" onClick={() => startEditing(project)}>
                  <FiEdit />
                </button>

                <button
                      title="Delete Project"
                      onClick={() => {
                        setProjectToDelete(project);
                        setShowConfirm(true);
                      }}
                    >
                  <FiTrash2 />
                </button>

              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
  <p className="no-task">{getEmptyProjectMessage()}</p>
)}

        </div>
      </div>
      {showConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <h3>Delete Project?</h3>
      <p>
        Are you sure you want to delete{" "}
        <strong>{projectToDelete?.name}</strong>?
      </p>
      <p className="warning-text">This action cannot be undone.</p>

      <div className="confirm-actions">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowConfirm(false);
            setProjectToDelete(null);
          }}
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={() => {
            deleteProject(projectToDelete._id);
            setShowConfirm(false);
            setProjectToDelete(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ProjectsPage;
