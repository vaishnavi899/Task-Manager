const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET USERS
router.get("/", auth, async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
});

module.exports = router;