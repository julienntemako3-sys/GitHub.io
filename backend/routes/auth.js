// routes/auth.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

const PI_API_BASE_URL =
  process.env.PI_API_BASE_URL || "https://api.minepi.com/v2";

/*
  POST /api/auth/pi

  Frontend sends:
  {
    accessToken,
    uid,
    username
  }

  IMPORTANT:
  We DO NOT trust uid/username from frontend.
  We verify accessToken directly with Pi /v2/me.
*/
router.post("/pi", async (req, res) => {
  try {
    const { accessToken } = req.body || {};

    if (!accessToken || typeof accessToken !== "string") {
      return res.status(400).json({
        success: false,
        message: "Pi access token manquant."
      });
    }

    const piResponse = await axios.get(
      `${PI_API_BASE_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        },
        timeout: 15000
      }
    );

    const piUser = piResponse.data;

    if (!piUser || !piUser.uid) {
      return res.status(401).json({
        success: false,
        message: "Réponse Pi invalide."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authentification Pi réussie.",
      user: {
        uid: piUser.uid,
        username: piUser.username || null
      }
    });

  } catch (error) {
    const status = error.response?.status || 500;
    const piData = error.response?.data;

    console.error("Pi authentication error:", {
      status,
      data: piData,
      message: error.message
    });

    if (status === 401) {
      return res.status(401).json({
        success: false,
        message: "Le token Pi est invalide ou expiré."
      });
    }

    return res.status(502).json({
      success: false,
      message: "Le serveur Pi n'a pas pu vérifier votre authentification."
    });
  }
});

/*
  Simple backend status endpoint.
  Useful for testing:
  GET /api/auth/status
*/
router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "WorldArts Pi Authentication",
    status: "ready"
  });
});

module.exports = router;
