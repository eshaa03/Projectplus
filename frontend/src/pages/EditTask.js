import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load existing task
  useEffect(() => {
    fetch(`${API_URL}/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description);
      })
      .catch(err => console.error(err));
  }, [id, API_URL]);

  const updateTask = () => {
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })
      .then(() => navigate(-1))
      .catch(err => console.error(err));
  };

  return (
    <div className="edit-task">
      <h2>Edit Task</h2>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button onClick={updateTask}>Update</button>
    </div>
  );
}
