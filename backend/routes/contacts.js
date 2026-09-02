
const express = require("express");

const router = express.Router();

/*
 * WORLDARTS CONTACT API
 * Route: /api/contact
 *
 * Iyi route:
 * - yakira ubutumwa bwo kuri Contact / Support
 * - igenzura name, email na message
 * - ntiyongera dependency nshasha
 * - nta UUID ikoresha
 * - ibika message muri memory kugira API ikore neza
 */

const messages = [];

/* =========================
   HELPERS
========================= */

function cleanText(value) {
  return String(value ?? "").trim();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================
   POST /api/contact
   Send contact message
========================= */

router.post("/", (req, res) => {
  try {
    const body = req.body || {};

    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const subject = cleanText(body.subject);
    const message = cleanText(body.message);

    /* Required fields */
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Le nom est obligatoire."
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "L'adresse email est obligatoire."
      });
    }

    if (!validEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Adresse email invalide."
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Le message est obligatoire."
      });
    }

    /* Length protection */
    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Le nom est trop long."
      });
    }

    if (email.length > 200) {
      return res.status(400).json({
        success: false,
        error: "L'adresse email est trop longue."
      });
    }

    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        error: "Le sujet est trop long."
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Le message ne peut pas dépasser 5000 caractères."
      });
    }

    /*
     * Simple ID local.
     * Aucun UUID/package externe.
     */
    const contactMessage = {
      id: "contact_" + Date.now(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "received"
    };

    messages.push(contactMessage);

    /*
     * Garder seulement les 100 derniers messages
     * pour éviter que la mémoire du serveur grossisse
     * indéfiniment.
     */
    if (messages.length > 100) {
      messages.shift();
    }

    /*
     * Pour Render/logs.
     * Le message est reçu par le backend.
     */
    console.log("WORLDARTS CONTACT MESSAGE");
    console.log({
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
      createdAt: contactMessage.createdAt
    });

    return res.status(200).json({
      success: true,
      message: "Votre message a bien été envoyé. Merci de contacter WorldArts.",
      data: {
        id: contactMessage.id,
        status: "received"
      }
    });

  } catch (error) {
    console.error("POST /api/contact error:", error);

    return res.status(500).json({
      success: false,
      error: "Impossible d'envoyer votre message pour le moment."
    });
  }
});

/* =========================
   GET /api/contact
   API health/status
========================= */

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "WorldArts Contact API",
    status: "online",
    messagesReceived: messages.length
  });
});

/* =========================
   GET /api/contact/messages
   Internal check
========================= */

router.get("/messages", (req, res) => {
  return res.status(200).json({
    success: true,
    count: messages.length,
    messages: messages
  });
});

/* =========================
   EXPORT
========================= */

module.exports = router;
