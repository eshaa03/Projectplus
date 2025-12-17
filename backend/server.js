const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 

const addTaskRoute = require("./routes/AddTaskRoute");
const projectRoute = require("./routes/ProjectPageRoute");
const settingsRoute = require("./routes/SettingsPageRoute");
const authRoute = require("./routes/authRoute");
const dashboardRoute = require("./routes/DashboardRoute");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", addTaskRoute);
app.use("/api/projects", projectRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
