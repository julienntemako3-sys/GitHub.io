const express = require('express');

const router = express.Router();

const PI_API_BASE_URL = (
  process.env.PI_API_BASE_URL || 'https://api.minepi.com'
).replace(/\/$/, '');

const PI_API_KEY = process.env.PI_API_KEY;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getPiHeaders() {
  return {
    Authorization: `Key ${PI_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

function checkPiApiKey(res) {
  if (!PI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'PI_API_KEY is not configured on the server.'
    });
  }

  return true;
}

async function piRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getPiHeaders(),
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
      data?.message ||
      data?.error ||
      `Pi API request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// --------------------------------------------------
// Health
// --------------------------------------------------

router.get('/health', (req, res) => {
  return res.json({
    success: true,
    service: 'WorldArts payments',
    piApiConfigured: Boolean(PI_API_KEY),
    piApiBaseUrl: PI_API_BASE_URL
  });
});

// --------------------------------------------------
// Get / verify a Pi payment
// --------------------------------------------------

router.get('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(400).json({
      success: false,
      error: 'paymentId is required.'
    });
  }

  if (checkPiApiKey(res) !== true) {
    return;
  }

  try {
    const payment = await piRequest(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`
    );

    return res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error(
      'Pi payment verification error:',
      error.data || error.message
    );

    return res.status(error.status || 502).json({
      success: false,
      error: 'Unable to verify the Pi payment.'
    });
  }
});

// --------------------------------------------------
// Approve Pi payment
// --------------------------------------------------

router.post('/approve', async (req, res) => {
  const { paymentId } = req.body || {};

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'paymentId is required.'
    });
  }

  if (checkPiApiKey(res) !== true) {
    return;
  }

  try {
    // First check the payment
    const payment = await piRequest(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`
    );

    // Already approved
    if (payment?.status?.developer_approved === true) {
      return res.json({
        success: true,
        approved: true,
        alreadyApproved: true,
        payment
      });
    }

    // Approve payment
    const approvedPayment = await piRequest(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({})
      }
    );

    return res.json({
      success: true,
      approved: true,
      payment: approvedPayment
    });
  } catch (error) {
    console.error(
      'Pi payment approval error:',
      error.data || error.message
    );

    return res.status(error.status || 502).json({
      success: false,
      approved: false,
      error: 'Unable to approve the Pi payment.'
    });
  }
});

// --------------------------------------------------
// Complete Pi payment
// --------------------------------------------------

router.post('/complete', async (req, res) => {
  const { paymentId, txid } = req.body || {};

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'paymentId is required.'
    });
  }

  if (!txid || typeof txid !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'txid is required.'
    });
  }

  if (checkPiApiKey(res) !== true) {
    return;
  }

  try {
    // Check current payment status
    const payment = await piRequest(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`
    );

    // Already completed
    if (payment?.status?.developer_completed === true) {
      return res.json({
        success: true,
        completed: true,
        alreadyCompleted: true,
        payment
      });
    }

    // Payment must be approved first
    if (payment?.status?.developer_approved !== true) {
      return res.status(409).json({
        success: false,
        completed: false,
        error: 'Payment has not been approved by the developer.'
      });
    }

    // Complete payment
    const completedPayment = await piRequest(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({
          txid
        })
      }
    );

    return res.json({
      success: true,
      completed: true,
      payment: completedPayment
    });
  } catch (error) {
    console.error(
      'Pi payment completion error:',
      error.data || error.message
    );

    return res.status(error.status || 502).json({
      success: false,
      completed: false,
      error: 'Unable to complete the Pi payment.'
    });
  }
});

// --------------------------------------------------
// Export
// --------------------------------------------------

module.exports = router;
