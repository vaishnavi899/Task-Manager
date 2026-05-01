const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ✅ Use Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err.message));

// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));