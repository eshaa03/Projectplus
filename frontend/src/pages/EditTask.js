import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load existing task
  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description);
      });
  }, [id]);

  const updateTask = () => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    }).then(() => navigate(-1));
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
