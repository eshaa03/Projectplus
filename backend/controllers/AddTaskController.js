const Task = require("../modals/AddTaskModal");

// GET tasks (all or for a specific project)
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    let tasks;
    if (projectId) {
      tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    } else {
      tasks = await Task.find().sort({ createdAt: -1 }); // optional: admin view
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    if (!projectId) return res.status(400).json({ error: "Project ID required" });

    const newTask = await Task.create({
      title,
      description,
      projectId,
      status: "pending",
      user: req.userId // ✅ assign the logged-in user
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE (EDIT) task
exports.updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, editedAt: new Date() },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await Task.findByIdAndUpdate(req.params.id, {
      status: status.toLowerCase().replace(/\s+/g, "-")
    });

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
