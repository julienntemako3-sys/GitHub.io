const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(helmet());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WorldArts Backend is running",
    version: "1.0.0"
  });
});

// =========================
// API STATUS
// =========================

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "WorldArts API is online"
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/artworks", require("./routes/artworks"));
app.use("/api/artists", require("./routes/artists"));
app.use("/api/contact", require("./routes/contact"));

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("WorldArts Backend Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`WorldArts Backend running on port ${PORT}`);
});
