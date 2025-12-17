import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { user, setUser, token, loading } = useContext(UserContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    avatar: ""
  });

  const [previewImage, setPreviewImage] = useState("");

  // Load user data
  useEffect(() => {
    if (user) {
      let avatarURL = user.avatar || "";
      if (avatarURL && !avatarURL.startsWith("http") && !avatarURL.startsWith("data:")) {
        avatarURL = `data:image/png;base64,${avatarURL}`;
      }

      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        avatar: avatarURL
      }));

      setPreviewImage(avatarURL);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // ✅ Image validation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ FORM VALIDATION
  const validateForm = () => {
    // Name
    if (!profile.name.trim()) {
      alert("Name is required");
      return false;
    }
    if (profile.name.trim().length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    // Email
    if (!profile.email.trim()) {
      alert("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Password change validation
   if (profile.newPassword) {
  if (!profile.currentPassword) {
    alert("Current password is required to change password");
    return false;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(profile.newPassword)) {
    alert(
      "New password must be at least 6 characters and include at least one letter and one number"
    );
    return false;
  }
}



    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/settings/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            avatar: previewImage,
            currentPassword: profile.currentPassword,
            newPassword: profile.newPassword,
          }),
        }
      );

          let updated;
      try {
        updated = await res.json();
      } catch {
        alert("Uploaded data is too large. Please upload a smaller image.");
        return;
      }

      if (res.ok) {

        let updatedAvatar = updated.avatar || "";
        if (updatedAvatar && !updatedAvatar.startsWith("http") && !updatedAvatar.startsWith("data:")) {
          updatedAvatar = `data:image/png;base64,${updatedAvatar}`;
        }

        setUser({ ...updated, avatar: updatedAvatar });
        setProfile(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          avatar: updatedAvatar
        }));
        setPreviewImage(updatedAvatar);

        alert("Profile updated successfully!");
      } else {
        alert(updated.message || "Failed to update profile");
      }
    }catch (err) {
      console.error(err);
      alert("Request failed. Image size may be too large.");
    }

  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Profile Settings</h2>

        <div className="profile-pic-section">
          <img
            src={previewImage || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-img"
          />
          <label htmlFor="upload" className="upload-btn">Change Picture</label>
          <input
            type="file"
            id="upload"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </div>

        <div className="settings-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={profile.currentPassword} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={profile.newPassword} onChange={handleChange} />
          </div>
        </div>

        <div className="form-buttons">
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
