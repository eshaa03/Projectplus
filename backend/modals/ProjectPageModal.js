const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
