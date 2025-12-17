const Project = require("../modals/ProjectPageModal");

// GET all projects for a specific user
exports.getProjects = async (req, res) => {
  try {
    const userId = req.userId; // get from request (middleware or front-end)
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET project by ID for a specific user
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE new project for a specific user
// CREATE new project for a specific user
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body; // make sure front-end sends { name: "Project Name" }
    const userId = req.userId;

    if (!name) return res.status(400).json({ error: "Project name is required" });

    const project = await Project.create({
      name,
      user: userId,
      createdAt: new Date(),
      editedAt: new Date()
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE project for a specific user
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.userId;

    const updated = await Project.findOneAndUpdate(
      { _id: id, user: userId },
      { name, editedAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Cannot update project" });
  }
};

// DELETE project for a specific user
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.userId;
    const deleted = await Project.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete project" });
  }
};
