const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-Controller");
const authMiddleware = require("../middleware/authMiddleware");
// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);


router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
