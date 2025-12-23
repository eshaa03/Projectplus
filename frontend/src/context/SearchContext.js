import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import api from "../utils/api";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Get token DIRECTLY from UserContext at top level
  const userContext = useContext(UserContext);
  const token = userContext?.token;

  const fetchProjects = useCallback(async () => {
    if (!token) {
      console.log('No token, clearing projects');
      setProjects([]);
      return;
    }

    console.log('Fetching projects with token:', token.substring(0, 20) + '...'); // Debug

    setLoading(true);
    try {
      const res = await api.get("/projects");
      
      console.log('Projects response data:', res.data.length); // Debug

      const projectsWithTasks = await Promise.all(
        res.data.map(async (proj) => {
          const taskRes = await api.get(`/tasks?projectId=${proj._id}`);
          const tasks = taskRes.data;
          return { ...proj, tasks: tasks.map(t => ({ ...t, projectName: proj.name })) };
        })
      );

      console.log('Final projects with tasks:', projectsWithTasks.length); // Debug
      setProjects(projectsWithTasks);
    } catch (err) {
      console.error("Search fetch failed:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Fetch on token change OR manual trigger
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, fetchProjects]);

  return (
    <SearchContext.Provider
      value={{ search, setSearch, projects, setProjects, loading, fetchProjects }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
