
// routes/payments.js
// WorldArts — Pi Network Payment Routes

const express = require("express");
const router = express.Router();

const { payments } = require("../config/store");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const PI_API_BASE_URL = String(
  process.env.PI_API_BASE_URL || "https://api.minepi.com"
).replace(/\/$/, "");

const PI_API_KEY = String(process.env.PI_API_KEY || "").trim();

/* =========================================================
   PI API HELPERS
   ========================================================= */

function piHeaders() {
  return {
    Authorization: `Key ${PI_API_KEY}`,
    "Content-Type": "application/json"
  };
}

async function piRequest(url, options = {}) {
  if (!PI_API_KEY) {
    const error = new Error(
      "PI_API_KEY ntisobanuwe muri environment variables."
    );

    error.status = 500;
    throw error;
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

function getErrorMessage(error, fallback) {
  return (
    error?.data?.error ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
}

function paymentBelongsToUser(payment, user) {
  if (!payment || !user) return false;

  if (!payment.uid || !user.uid) {
    return true;
  }

  return payment.uid === user.uid;
}

/* =========================================================
   APPROVE PAYMENT
   POST /api/payments/approve
   ========================================================= */

router.post("/approve", optionalAuth, async (req, res) => {
  try {
    const { paymentId } = req.body || {};

    if (!paymentId || typeof paymentId !== "string") {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const cleanPaymentId = paymentId.trim();

    if (!cleanPaymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId ntishobora kuba empty."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/` +
      `${encodeURIComponent(cleanPaymentId)}/approve`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST"
    });

    const existing = payments.get(cleanPaymentId) || {};

    const payment = {
      ...existing,

      paymentId: cleanPaymentId,

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

      approvedAt:
        existing.approvedAt ||
        new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };

    payments.set(cleanPaymentId, payment);

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error(
      "[WorldArts] Approve Payment Error:",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error: getErrorMessage(
        error,
        "Ntivyashobotse kwemeza payment ya Pi."
      )
    });
  }
});

/* =========================================================
   COMPLETE PAYMENT
   POST /api/payments/complete
   ========================================================= */

router.post("/complete", optionalAuth, async (req, res) => {
  try {
    const { paymentId, txid } = req.body || {};

    if (!paymentId || typeof paymentId !== "string") {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    if (!txid || typeof txid !== "string") {
      return res.status(400).json({
        success: false,
        error: "txid irakenewe."
      });
    }

    const cleanPaymentId = paymentId.trim();
    const cleanTxid = txid.trim();

    if (!cleanPaymentId || !cleanTxid) {
      return res.status(400).json({
        success: false,
        error: "paymentId na txid ntibishobora kuba empty."
      });
    }

    const existing = payments.get(cleanPaymentId) || {};

    /*
     * Niba payment yari isanzwe yararangiye,
     * ntidukore completion inshasha.
     */
    if (existing.status === "completed") {
      return res.status(200).json({
        success: true,
        payment: existing,
        alreadyCompleted: true
      });
    }

    /*
     * Niba hari user afise kuri request,
     * turagenzura ko payment ari yiwe.
     */
    if (
      req.user &&
      existing.uid &&
      !paymentBelongsToUser(existing, req.user)
    ) {
      return res.status(403).json({
        success: false,
        error: "Nta burenganzira ufise kuri iyi payment."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/` +
      `${encodeURIComponent(cleanPaymentId)}/complete`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST",
      body: JSON.stringify({
        txid: cleanTxid
      })
    });

    /*
     * Turandika completed GUSA iyo Pi API
     * yemeje completion neza.
     */
    const payment = {
      ...existing,

      paymentId: cleanPaymentId,

      uid:
        req.user?.uid ||
        existing.uid ||
        null,

      userId:
        req.user?.id ||
        existing.userId ||
        null,

      txid: cleanTxid,

      status: "completed",

      piPayment,

      completedAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()
    };

    payments.set(cleanPaymentId, payment);

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error(
      "[WorldArts] Complete Payment Error:",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error: getErrorMessage(
        error,
        "Ntivyashobotse kurangiza payment ya Pi."
      )
    });
  }
});

/* =========================================================
   CANCEL PAYMENT
   POST /api/payments/cancel
   ========================================================= */

router.post("/cancel", optionalAuth, async (req, res) => {
  try {
    const { paymentId } = req.body || {};

    if (!paymentId || typeof paymentId !== "string") {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const cleanPaymentId = paymentId.trim();

    if (!cleanPaymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId ntishobora kuba empty."
      });
    }

    const existing = payments.get(cleanPaymentId) || {};

    if (
      req.user &&
      existing.uid &&
      !paymentBelongsToUser(existing, req.user)
    ) {
      return res.status(403).json({
        success: false,
        error: "Nta burenganzira ufise kuri iyi payment."
      });
    }

    const paymentUrl =
      `${PI_API_BASE_URL}/v2/payments/` +
      `${encodeURIComponent(cleanPaymentId)}/cancel`;

    const piPayment = await piRequest(paymentUrl, {
      method: "POST"
    });

    const payment = {
      ...existing,

      paymentId: cleanPaymentId,

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

    payments.set(cleanPaymentId, payment);

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error(
      "[WorldArts] Cancel Payment Error:",
      error.data || error.message
    );

    return res.status(error.status || 500).json({
      success: false,
      error: getErrorMessage(
        error,
        "Ntivyashobotse guhagarika payment ya Pi."
      )
    });
  }
});

/* =========================================================
   INCOMPLETE PAYMENT
   POST /api/payments/incomplete
   ========================================================= */

router.post("/incomplete", optionalAuth, (req, res) => {
  try {
    const { paymentId, payment } = req.body || {};

    if (!paymentId || typeof paymentId !== "string") {
      return res.status(400).json({
        success: false,
        error: "paymentId irakenewe."
      });
    }

    const cleanPaymentId = paymentId.trim();

    if (!cleanPaymentId) {
      return res.status(400).json({
        success: false,
        error: "paymentId ntishobora kuba empty."
      });
    }

    const existing = payments.get(cleanPaymentId) || {};

    const record = {
      ...existing,

      paymentId: cleanPaymentId,

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

    payments.set(cleanPaymentId, record);

    return res.status(200).json({
      success: true,
      payment: record
    });

  } catch (error) {
    console.error(
      "[WorldArts] Incomplete Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kubika incomplete payment."
    });
  }
});

/* =========================================================
   GET PAYMENT BY ID
   IMPORTANT:
   IYI ROUTE IZA INYUMA YA /history NA /incomplete
   ========================================================= */

router.get("/:id", requireAuth, (req, res) => {
  try {
    const paymentId = String(req.params.id || "").trim();

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: "Payment ID irakenewe."
      });
    }

    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment ntibashoboye kuyibona."
      });
    }

    if (
      payment.uid &&
      req.user?.uid &&
      payment.uid !== req.user.uid
    ) {
      return res.status(403).json({
        success: false,
        error: "Nta burenganzira ufise kuri iyi payment."
      });
    }

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error(
      "[WorldArts] Get Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kuronka payment."
    });
  }
});

/* =========================================================
   PAYMENT HISTORY
   IMPORTANT:
   IRI ROUTE RIZA MBERE YA /:id
   ========================================================= */

router.get("/history", requireAuth, (req, res) => {
  try {
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

    return res.status(200).json({
      success: true,
      payments: list
    });

  } catch (error) {
    console.error(
      "[WorldArts] Payment History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kuronka payment history."
    });
  }
});

/* =========================================================
   INCOMPLETE PAYMENTS
   IMPORTANT:
   IRI ROUTE RIZA MBERE YA /:id
   ========================================================= */

router.get("/incomplete", requireAuth, (req, res) => {
  try {
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

    return res.status(200).json({
      success: true,
      payments: list
    });

  } catch (error) {
    console.error(
      "[WorldArts] Incomplete Payments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kuronka incomplete payments."
    });
  }
});

/* =========================================================
   ALL CURRENT USER PAYMENTS
   GET /api/payments/
   ========================================================= */

router.get("/", requireAuth, (req, res) => {
  try {
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

    return res.status(200).json({
      success: true,
      payments: list
    });

  } catch (error) {
    console.error(
      "[WorldArts] Payments List Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Ntivyashobotse kuronka payments."
    });
  }
});

module.exports = router;
