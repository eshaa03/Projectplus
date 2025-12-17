import { useState, useEffect } from "react";
import "./AddTask.css";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

  // ✅ Get project name from URL
  useEffect(() => {
    if (projectNameFromUrl) {
      setProjectName(decodeURIComponent(projectNameFromUrl));
    }
  }, [projectNameFromUrl]);

  // 🔹 Load tasks for this project
  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:5000/api/tasks?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, [projectId]);

  // Add task
  const addTask = () => {
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ send token
      },
      body: JSON.stringify({
        title,
        description: desc,
        projectId
      })
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
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE"
    }).then(() => {
      setTasks(tasks.filter(t => t._id !== id));
    });
  };

  // Edit task popup
  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDesc(task.description);
    setShowPopup(true);
  };

  const saveEdit = () => {
    fetch(`http://localhost:5000/api/tasks/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: desc,
        projectId
      })
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
    fetch(`http://localhost:5000/api/tasks/status/${id}`, {
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

  // ✅ Updated statusOptions with lowercase values
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

  return (
    <div className="task-page">
      <div className="task-page-card">
        <div className="task-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2>Tasks for: {projectName}</h2>

          <button className="add-btn" onClick={() => setShowPopup(true)}>
            + Add
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map(task => (
            <div className="task-card" key={task._id}>
              <div className="task-texts">
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <select
                    className={`status-select ${getStatusClass(task.status)}`}
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task._id, e.target.value)
                    }
                  >
                    {statusOptions.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </p>

                <p className="dates">
                  Created: {new Date(task.createdAt).toLocaleString()}
                  {task.editedAt &&
                    <> | Edited: {new Date(task.editedAt).toLocaleString()}</>}
                </p>
              </div>

              <div className="task-actions">
                <button className="edit" onClick={() => startEdit(task)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="no-task">No tasks yet.</p>
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
              <button
                className="cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>

              {editingId ? (
                <button className="save" onClick={saveEdit}>
                  Save
                </button>
              ) : (
                <button className="save" onClick={addTask}>
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
