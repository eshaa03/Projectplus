import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser, setToken, loading } = useContext(UserContext); // added loading
  const navigate = useNavigate();

  // ✅ Prevent crash before user loads
 if (loading) {
  return <div className="navbar">Loading...</div>;
}


  if (!user) {
    return (
      <div className="navbar">
        <div className="navbar-left" />
        <div className="navbar-right" />
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // <-- also clear user from localStorage
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="nav-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="user-profile-button"
          onClick={() => navigate("/settings")}
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
      </div>
    </div>
  );
};

export default Navbar;
