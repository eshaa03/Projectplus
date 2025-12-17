import api from "../utils/api";

export async function getTasks(projectId) {
  const res = await api.get(`/tasks?projectId=${projectId}`);
  return res.data;
}

export async function createTask(payload) {
  const res = await api.post("/tasks", payload);
  return res.data;
}

export async function updateTask(id, payload) {
  const res = await api.put(`/tasks/${id}`, payload);
  return res.data;
}

export async function deleteTask(id) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}
