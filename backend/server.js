// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const paymentsRoutes = require("./routes/payments");
const artworksRoutes = require("./routes/artworks");
const artistsRoutes = require("./routes/artists");

const { notFound, errorHandler } =
  require("./middleware/errorHandler");

const app = express();

/* ============================================================
   SECURITY
============================================================ */

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

/* ============================================================
   LOGGING
============================================================ */

app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? "combined"
      : "dev"
  )
);

/* ============================================================
   CORS
============================================================ */

const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      /*
        Requests without Origin are allowed.
        This is useful for Pi Browser/native requests.
      */
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, "");

      /*
        During initial configuration, if FRONTEND_URLS
        is empty, allow the request instead of creating
        a mysterious CORS failure.
      */
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(cleanOrigin)
      ) {
        return callback(null, true);
      }

      console.error(
        "CORS blocked origin:",
        cleanOrigin
      );

      return callback(
        new Error(
          `Origine non autorisée par CORS : ${cleanOrigin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

/* ============================================================
   BODY PARSER
============================================================ */

app.use(
  express.json({
    limit: "1mb"
  })
);

/* ============================================================
   RATE LIMIT
============================================================ */

const limiter = rateLimit({
  windowMs:
    Number(process.env.RATE_LIMIT_WINDOW_MS) ||
    15 * 60 * 1000,

  max:
    Number(process.env.RATE_LIMIT_MAX) ||
    200,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    error: "Trop de requêtes. Veuillez réessayer plus tard."
  }
});

app.use(limiter);

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "worldarts-backend",
    timestamp: new Date().toISOString()
  });
});

/* ============================================================
   ROOT
============================================================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorldArts Backend is running",
    version: "1.0.0"
  });
});

/* ============================================================
   API ROUTES
============================================================ */

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/artworks", artworksRoutes);
app.use("/api/artists", artistsRoutes);

/* ============================================================
   404
============================================================ */

app.use(notFound);

/* ============================================================
   ERROR HANDLER
============================================================ */

app.use(errorHandler);

/* ============================================================
   SERVER
============================================================ */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `WorldArts backend running on port ${PORT}`
  );

  console.log(
    `Environment: ${
      process.env.NODE_ENV || "development"
    }`
  );

  console.log(
    `Pi API: ${
      process.env.PI_API_BASE_URL ||
      "https://api.minepi.com/v2"
    }`
  );
});

module.exports = app;
