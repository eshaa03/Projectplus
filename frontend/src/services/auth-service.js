// src/services/authService.js
import api from "../utils/api"; // axios instance

// register user
export async function register({ name, email, password }) {
  const payload = { name, email, password };
  const res = await api.post("/auth/register", payload);
  return res.data; // expected: { user, token }
}

// login user
export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // expected: { user, token }
}

// save token to localStorage
export function saveToken(token) {
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// remove token (logout)
export function clearToken() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
}

// get current token
export function getToken() {
  return localStorage.getItem("token");
}
