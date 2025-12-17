const express = require("express");
const router = express.Router();

const Task = require("../modals/AddTaskModal"); // ✅ MISSING IMPORT
const taskController = require("../controllers/AddTaskController");
const authMiddleware = require("../middleware/authMiddleware"); 
// 🔹 Get tasks (project-wise)
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;

    const filter = projectId ? { projectId } : {};
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// 🔹 Create task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    const task = new Task({
      title,
      description,
      projectId,
      status: "pending",
      user: req.userId // ✅ now this will be set correctly
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});


router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.put("/status/:id", taskController.updateStatus);

module.exports = router;
