
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WorldArts Backend is running",
    version: "1.0.0"
  });
});

// API status
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "WorldArts API is online"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`WorldArts Backend running on port ${PORT}`);
});
