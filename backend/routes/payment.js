// routes/payments.js
// WorldArts — Pi Network Payment Routes

const express = require("express");
const router = express.Router();

const { payments, users } = require("../config/store");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const PI_API_BASE_URL = String(
  process.env.PI_API_BASE_URL || "https://api.minepi.com"
).replace(/\/$/, "");

const PI_API_KEY = process.env.PI_API_KEY || "";

/**
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */

function piHeaders() {
  return {
    Authorization: `Key ${PI_API_KEY}`,
    "Content-Type": "application/json"
  };
}

async function piRequest(url, options = {}) {
  if (!PI_API_KEY) {
    throw new Error("PI_API_KEY ntisobanuwe muri .env.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...piHeaders(),
      ...(options.headers || {})
    }
  });

  let data = null;

  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.error ||
      data?.message ||
      `Pi API error ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}


/**
 * ---------------------------------------------------------
 * POST /api/payments/approve
 *
 * Called by frontend when Pi says:
 * onReadyForServerApproval(paymentId)
 * ---------------------------------------------------------
 */

router.post("/approve", optionalAuth, async (req, res) => {
  try {
    const { paymentId } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/approve`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST"
    });

    const existing = payments.get(paymentId) || {};

    const payment = {
      ...existing,
      paymentId,
      uid:
        req.user?.uid ||
        existing.uid ||
        null,

      userId:
        req.user?.id ||
        existing.userId ||
        null,

      status: "approved",

      piPayment,

      approvedAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };

    payments.set(paymentId, payment);

    return res.json({
      success: true,
      payment
    });

  } catch (error) {

    console.error(
      "[Approve Payment]",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error:
        error.data?.error ||
        error.message ||
        "Ntivyashobotse kwemeza payment."
    });
  }
});


/**
 * ---------------------------------------------------------
 * POST /api/payments/complete
 *
 * Called by frontend when Pi says:
 * onReadyForServerCompletion(paymentId, txid)
 * ---------------------------------------------------------
 */

router.post("/complete", optionalAuth, async (req, res) => {
  try {
    const { paymentId, txid } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    if (!txid) {
      return res.status(400).json({
        success: false,
        error: "txid irakenewe."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/complete`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST",
      body: JSON.stringify({
        txid
      })
    });

    const existing = payments.get(paymentId) || {};

    const payment = {
      ...existing,

      paymentId,

      uid:
        req.user?.uid ||
        existing.uid ||
        null,

      userId:
        req.user?.id ||
        existing.userId ||
        null,

      txid,

      status: "completed",

      piPayment,

      completedAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };

    payments.set(paymentId, payment);

    return res.json({
      success: true,
      payment
    });

  } catch (error) {

    console.error(
      "[Complete Payment]",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error:
        error.data?.error ||
        error.message ||
        "Ntivyashobotse kurangiza payment."
    });
  }
});


/**
 * ---------------------------------------------------------
 * POST /api/payments/cancel
 *
 * Used when a payment needs to be cancelled.
 * ---------------------------------------------------------
 */

router.post("/cancel", optionalAuth, async (req, res) => {
  try {
    const { paymentId } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/cancel`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST"
    });

    const existing = payments.get(paymentId) || {};

    const payment = {
      ...existing,

      paymentId,

      uid:
        req.user?.uid ||
        existing.uid ||
        null,

      userId:
        req.user?.id ||
        existing.userId ||
        null,

      status: "cancelled",

      piPayment,

      cancelledAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };

    payments.set(paymentId, payment);

    return res.json({
      success: true,
      payment
    });

  } catch (error) {

    console.error(
      "[Cancel Payment]",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error:
        error.data?.error ||
        error.message ||
        "Ntivyashobotse guhagarika payment."
    });
  }
});


/**
 * ---------------------------------------------------------
 * POST /api/payments/incomplete
 *
 * IMPORTANT:
 * script.js yawe ikoresha POST kuri iyi route.
 *
 * Iyo frontend ibonye payment itarangiye,
 * tuyibika muri memory kugira ngo tuyikurikirane.
 * ---------------------------------------------------------
 */

router.post("/incomplete", optionalAuth, (req, res) => {
  try {

    const { paymentId, payment } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const existing = payments.get(paymentId) || {};

    const record = {
      ...existing,

      paymentId,

      uid:
        req.user?.uid ||
        payment?.user_uid ||
        existing.uid ||
        null,

      userId:
        req.user?.id ||
        existing.userId ||
        null,

      status:
        existing.status === "completed"
          ? "completed"
          : "incomplete",

      piPayment:
        payment ||
        existing.piPayment ||
        null,

      updatedAt: new Date().toISOString()
    };

    payments.set(paymentId, record);

    return res.json({
      success: true,
      payment: record
    });

  } catch (error) {

    console.error(
      "[Incomplete Payment]",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kubika incomplete payment."
    });
  }
});


/**
 * ---------------------------------------------------------
 * GET /api/payments/:id
 *
 * Get one payment.
 * ---------------------------------------------------------
 */

router.get("/:id", requireAuth, (req, res) => {

  const payment = payments.get(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment ntibashoboye kuyibona."
    });
  }

  if (
    payment.uid &&
    req.user.uid &&
    payment.uid !== req.user.uid
  ) {
    return res.status(403).json({
      success: false,
      error: "Nta burenganzira ufise kuri iyi payment."
    });
  }

  return res.json({
    success: true,
    payment
  });
});


/**
 * ---------------------------------------------------------
 * GET /api/payments/history
 * ---------------------------------------------------------
 */

router.get("/history", requireAuth, (req, res) => {

  const list = Array.from(payments.values())
    .filter(payment =>
      payment.uid === req.user.uid
    )
    .sort((a, b) =>
      String(b.updatedAt || b.createdAt || "")
        .localeCompare(
          String(a.updatedAt || a.createdAt || "")
        )
    );

  return res.json({
    success: true,
    payments: list
  });
});


/**
 * ---------------------------------------------------------
 * GET /api/payments/incomplete
 *
 * This GET route is kept too.
 *
 * So backend supports BOTH:
 * GET  /incomplete
 * POST /incomplete
 *
 * This makes it compatible with frontend/backend versions.
 * ---------------------------------------------------------
 */

router.get("/incomplete", requireAuth, (req, res) => {

  const list = Array.from(payments.values())
    .filter(payment =>
      payment.uid === req.user.uid &&
      payment.status !== "completed"
    )
    .sort((a, b) =>
      String(b.updatedAt || b.createdAt || "")
        .localeCompare(
          String(a.updatedAt || a.createdAt || "")
        )
    );

  return res.json({
    success: true,
    payments: list
  });
});


/**
 * ---------------------------------------------------------
 * GET /api/payments
 *
 * Basic authenticated payment list.
 * ---------------------------------------------------------
 */

router.get("/", requireAuth, (req, res) => {

  const list = Array.from(payments.values())
    .filter(payment =>
      payment.uid === req.user.uid
    );

  return res.json({
    success: true,
    payments: list
  });
});


module.exports = router;
