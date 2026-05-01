const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// CREATE PROJECT (ADMIN ONLY)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Only Admin can create project" });
  }

  const project = await Project.create({
    name: req.body.name,
    createdBy: req.user.id
  });

  res.json(project);
});

// GET PROJECTS
router.get("/", auth, async (req, res) => {
  const projects = await Project.find().populate("createdBy", "name");
  res.json(projects);
});

module.exports = router;