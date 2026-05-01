const router = require("express").Router();
const Task = require("../models/Task");

// GET tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("project", "name");

  res.json(tasks);
});

// CREATE task
router.post("/", async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user?.id // 🔥 auto assign
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

module.exports = router;