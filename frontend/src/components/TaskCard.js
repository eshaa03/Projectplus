import "./TaskCard.css";

export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <span>{task.status}</span>
    </div>
  );
}
