const Task = require("../modals/AddTaskModal");
const Project = require("../modals/ProjectPageModal");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const userProjects = await Project.find({ user: userId }).populate("tasks");

    // TASK COUNTS
    const completedTasks = await Task.countDocuments({
      status: "completed",
      projectId: { $in: userProjects.map(p => p._id) }
    });
    const pendingTasks = await Task.countDocuments({
      status: "pending",
      projectId: { $in: userProjects.map(p => p._id) }
    });
    const ongoingTasks = await Task.countDocuments({
      status: "in-progress",
      projectId: { $in: userProjects.map(p => p._id) }
    });

    // PROJECT COUNTS FOR PIE CHART (calculated dynamically)
  let completedProjects = 0;
let inProgressProjects = 0;
let notStartedProjects = 0;

for (const project of userProjects) {
  const tasks = await Task.find({ projectId: project._id });

  if (tasks.length === 0) {
    notStartedProjects++;
    continue;
  }

  const allCompleted = tasks.every(t => t.status === "completed");
  const allPending = tasks.every(t => t.status === "pending");

  if (allCompleted) {
    completedProjects++;
  } else if (allPending) {
    notStartedProjects++;
  } else {
    inProgressProjects++;
  }
}



    const totalProjects = userProjects.length;

    res.json({
      tasks: {
        completed: completedTasks,
        pending: pendingTasks,
        ongoing: ongoingTasks
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        inProgress: inProgressProjects,
        notStarted: notStartedProjects
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
