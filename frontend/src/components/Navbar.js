import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useSearch } from "../context/SearchContext";
import { FiLogOut, FiSearch } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser, setToken, loading } = useContext(UserContext);
  const { search, setSearch, projects, setProjects, loading: searchLoading } = useSearch();
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Close dropdowns if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearch("");
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearch]);
 const handleSearchKeyDown = (e) => {
  if (!filteredResults.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActiveIndex((prev) =>
      prev < filteredResults.length - 1 ? prev + 1 : 0
    );
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setActiveIndex((prev) =>
      prev > 0 ? prev - 1 : filteredResults.length - 1
    );
  }

  if (e.key === "Enter") {
    e.preventDefault();
    const item =
      activeIndex >= 0
        ? filteredResults[activeIndex]
        : filteredResults[0];

    setSearch("");

    if (item.type === "project") {
      navigate(
        `/tasks?projectId=${item.id}&projectName=${encodeURIComponent(item.name)}`
      );
    } else {
      navigate(
        `/tasks?projectId=${item.projectId}&projectName=${encodeURIComponent(
          item.projectName
        )}`
      );
    }
  }
};


  if (loading) return <div className="navbar">Loading...</div>;

  if (!user)
    return (
      <div className="navbar">
        <div className="navbar-left" />
        <div className="navbar-right" />
      </div>
    );

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSearch(""); // clear search bar
    setProjects([]); // clear search results immediately
    navigate("/");
  };

  const highlightMatch = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const highlighted = text.replace(regex, `<span class="highlight-text">$1</span>`);
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const filteredResults =
    !searchLoading && search
      ? projects
          .flatMap((p) => [
            { type: "project", name: p.name || "", id: p._id },
            ...(p.tasks?.map((t) => ({
              type: "task",
              name: t.title || "",
              id: t._id,
              projectId: p._id,
              projectName: p.name,
            })) || []),
          ])
          .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      : [];

  return (
    <div className="navbar">
      <div className="navbar-left" />

      {/* 🔍 Search box */}
      <div className="navbar-search" ref={searchRef}>
        <FiSearch className="search-icon" /> {/* SVG icon inside input */}
        <input
          type="text"
          placeholder="Search projects or tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleSearchKeyDown}
        />

        {search && (
          <div className="search-dropdown">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <div
  key={item.type + item.id}
  className={`search-item ${
    index === activeIndex ? "active" : ""
  }`}
  onClick={() => {
    setSearch("");
    if (item.type === "project") {
      navigate(
        `/tasks?projectId=${item.id}&projectName=${encodeURIComponent(item.name)}`
      );
    } else {
      navigate(
        `/tasks?projectId=${item.projectId}&projectName=${encodeURIComponent(
          item.projectName
        )}`
      );
    }
  }}
>

                  {highlightMatch(item.name)}
                  {item.type === "task" && (
                    <span className="task-project">({item.projectName})</span>
                  )}
                </div>
              ))
            ) : (
              <div className="search-item">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Profile dropdown */}
      <div className="navbar-right" ref={profileRef}>
        <div className="profile-wrapper">
          <button
            className="user-profile-button"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                user.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <span className="user-name">{user.name}</span>
          </button>

          {openProfile && (
            <div className="profile-dropdown">
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <FiLogOut className="logout-icon" />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
