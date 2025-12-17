import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      if (u.avatar && !u.avatar.startsWith("http") && !u.avatar.startsWith("data:")) {
        u.avatar = `data:image/png;base64,${u.avatar}`;
      }
      return u;
    }
    return null;
  });

  const [loading, setLoading] = useState(!!token && !user); // true if we need to fetch user

  // Persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Fetch latest user from backend if token exists
  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.avatar && !data.avatar.startsWith("http") && !data.avatar.startsWith("data:")) {
            data.avatar = `data:image/png;base64,${data.avatar}`;
          }
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    }
  }, [token, user]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, loading }}>
      {children}
    </UserContext.Provider>
  );
};
