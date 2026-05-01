const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  dueDate: Date,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
});

module.exports = mongoose.model("Task", taskSchema);