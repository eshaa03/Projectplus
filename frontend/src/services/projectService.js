import React, { useEffect, useState } from "react";
import { getTasks, createTask } from "../services/taskService";

export default function Task({ projectId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getTasks(projectId);
      setTasks(data);
    })();
  }, [projectId]);

  return (
    <div>
      <h3>Tasks for project {projectId}</h3>
      <ul>
        {tasks.map(t => <li key={t._id}>{t.title} - {t.status}</li>)}
      </ul>
    </div>
  );
}
