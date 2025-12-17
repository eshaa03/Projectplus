const express = require("express");
const router = express.Router();
const projectController = require("../controllers/ProjectPageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, projectController.getProjects);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.post("/", authMiddleware, projectController.createProject);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
