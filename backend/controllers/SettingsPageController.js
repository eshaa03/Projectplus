const User = require("../modals/UserModal");
const bcrypt = require("bcryptjs");

// Update logged-in user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, avatar, currentPassword, newPassword } = req.body;

    // Verify current password if new password is provided
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ message: "Current password is required" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Current password is incorrect" });

      user.password = newPassword; // Will be hashed via pre-save hook
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    const userObj = updatedUser.toObject();
    delete userObj.password; // Don't send password
    res.json(userObj);

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
