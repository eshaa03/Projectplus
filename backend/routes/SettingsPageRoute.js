const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/SettingsPageController");

router.put("/update/:id", settingsController.updateProfile);

module.exports = router;
