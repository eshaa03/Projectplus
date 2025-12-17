const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
  type: String,
  enum: ["pending", "completed", "in-progress"],
  lowercase: true,
  required: true
},
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  user: { // ✅ add user reference
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  editedAt: Date
});

module.exports = mongoose.model("Task", taskSchema);
