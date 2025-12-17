export default function EditTaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const updateTask = () => {
    fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    }).then(onClose);
  };

  return (
    <div className="modal">
      <h3>Edit Task</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={updateTask}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
