import { useState, useEffect } from "react";
import "./AddTask.css";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiEdit, FiTrash2 } from "react-icons/fi";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [projectName, setProjectName] = useState("");

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const projectNameFromUrl = searchParams.get("projectName");

  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Get project name from URL
  useEffect(() => {
    if (projectNameFromUrl) {
      setProjectName(decodeURIComponent(projectNameFromUrl));
    }
  }, [projectNameFromUrl]);

  // Load tasks
  useEffect(() => {
    if (!projectId) return;

    fetch(`${API_URL}/api/tasks?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, [projectId, API_URL]);

  // Add task
  const addTask = () => {
    fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, description: desc, projectId })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([newTask, ...tasks]);
        resetForm();
        setShowPopup(false);
      })
      .catch(err => console.error(err));
  };

  // Delete task
 const confirmDelete = (taskId) => {
  setTaskToDelete(taskId);
  setShowConfirm(true);
};

const deleteTask = () => {
  fetch(`${API_URL}/api/tasks/${taskToDelete}`, {
    method: "DELETE",
  })
    .then(() => {
      setTasks(tasks.filter(t => t._id !== taskToDelete));
      setShowConfirm(false);
      setTaskToDelete(null);
    })
    .catch(err => console.error(err));
};


  // Edit task popup
  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDesc(task.description);
    setShowPopup(true);
  };

  const saveEdit = () => {
    fetch(`${API_URL}/api/tasks/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc, projectId })
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => (t._id === editingId ? updated : t)));
        resetForm();
        setShowPopup(false);
      });
  };

  // Update status
  const updateStatus = (id, status) => {
    fetch(`${API_URL}/api/tasks/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => (t._id === id ? updated : t)));
      });
  };

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setEditingId(null);
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" }
  ];

  const getStatusClass = (status) => {
    if (status === "pending") return "red";
    if (status === "in-progress") return "yellow";
    if (status === "completed") return "green";
    return "";
  };

  const filteredTasks =
    filterStatus === "ALL" ? tasks : tasks.filter(t => t.status === filterStatus);

  const getEmptyMessage = () => {
    if (filterStatus === "pending") return "No pending tasks.";
    if (filterStatus === "in-progress") return "No ongoing tasks.";
    if (filterStatus === "completed") return "No completed tasks.";
    return "No tasks yet.";
  };

  return (
    <div className="task-page">
      <div className="task-page-card">
        <div className="task-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h2>Tasks for: {projectName}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="filter-wrapper">
              <button
                className="filter-btn"
                title="Filter"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FiFilter />
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  <button onClick={() => { setFilterStatus("ALL"); setShowFilter(false); }}>All</button>
                  <button onClick={() => { setFilterStatus("completed"); setShowFilter(false); }}>Completed</button>
                  <button onClick={() => { setFilterStatus("in-progress"); setShowFilter(false); }}>Ongoing</button>
                  <button onClick={() => { setFilterStatus("pending"); setShowFilter(false); }}>Pending</button>
                </div>
              )}
            </div>

            <button className="add-btn" onClick={() => setShowPopup(true)}>+ Add</button>
          </div>
        </div>

        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div className="task-card" key={task._id}>
              <div className="task-texts">
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <select
                    className={`status-select ${getStatusClass(task.status)}`}
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </p>

                <p className="dates">
                  Created: {new Date(task.createdAt).toLocaleString()}
                  {task.editedAt && <> | Edited: {new Date(task.editedAt).toLocaleString()}</>}
                </p>
              </div>

              <div className="task-actions">
                <button className="edit" onClick={() => startEdit(task)} title="Edit">
                  <FiEdit />
                </button>
                <button
                    className="delete"
                    onClick={() => confirmDelete(task._id)}
                    title="Delete"
                  >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <p className="no-task">{getEmptyMessage()}</p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>{editingId ? "Edit Task" : "Add Task"}</h3>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Task description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="popup-buttons">
              <button className="cancel" onClick={() => setShowPopup(false)}>Cancel</button>
              {editingId ? (
                <button className="save" onClick={saveEdit}>Save</button>
              ) : (
                <button className="save" onClick={addTask}>Add</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Task?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{taskToDelete?.title}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone.</p>

            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowConfirm(false);
                  setTaskToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={deleteTask}
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
