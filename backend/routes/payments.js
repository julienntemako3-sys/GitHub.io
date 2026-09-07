const express = require('express');
const axios = require('axios');

const router = express.Router();

const PI_API_BASE_URL = (
  process.env.PI_API_BASE_URL || 'https://api.minepi.com'
).replace(/\/$/, '');

const PI_API_KEY = process.env.PI_API_KEY;

function requirePiApiKey(res) {
  if (!PI_API_KEY) {
    res.status(500).json({
      success: false,
      error: 'PI_API_KEY is not configured on the server.'
    });
    return false;
  }

  return true;
}

function piHeaders() {
  return {
    Authorization: `Key ${PI_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

/*
 * GET /api/payments/:paymentId
 * Vérifie les informations d'un paiement Pi.
 */
router.get('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(400).json({
      success: false,
      error: 'paymentId is required.'
    });
  }

  if (!requirePiApiKey(res)) return;

  try {
    const response = await axios.get(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: piHeaders(),
        timeout: 15000
      }
    );

    return res.json({
      success: true,
      payment: response.data
    });
  } catch (error) {
    console.error(
      'Pi payment verification error:',
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 502).json({
      success: false,
      error: 'Unable to verify the Pi payment.',
      details: error.response?.data || error.message
    });
  }
});


/*
 * POST /api/payments/approve
 *
 * Appelle l'API Pi pour approuver le paiement.
 *
 * Body:
 * {
 *   "paymentId": "PI_PAYMENT_ID"
 * }
 */
router.post('/approve', async (req, res) => {
  const { paymentId } = req.body || {};

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'paymentId is required.'
    });
  }

  if (!requirePiApiKey(res)) return;

  try {
    /*
     * Vérification préalable du paiement auprès de Pi.
     */
    const paymentResponse = await axios.get(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: piHeaders(),
        timeout: 15000
      }
    );

    const payment = paymentResponse.data;

    /*
     * Si Pi indique déjà que le paiement est approuvé,
     * on ne recommence pas inutilement.
     */
    if (payment?.status?.developer_approved === true) {
      return res.json({
        success: true,
        approved: true,
        alreadyApproved: true,
        payment
      });
    }

    /*
     * Approbation du paiement.
     */
    const approvalResponse = await axios.post(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/approve`,
      {},
      {
        headers: piHeaders(),
        timeout: 15000
      }
    );

    return res.json({
      success: true,
      approved: true,
      payment: approvalResponse.data
    });
  } catch (error) {
    console.error(
      'Pi payment approval error:',
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 502).json({
      success: false,
      approved: false,
      error: 'Unable to approve the Pi payment.',
      details: error.response?.data || error.message
    });
  }
});


/*
 * POST /api/payments/complete
 *
 * Complète le paiement Pi après réception du txid.
 *
 * Body:
 * {
 *   "paymentId": "PI_PAYMENT_ID",
 *   "txid": "BLOCKCHAIN_TRANSACTION_ID"
 * }
 */
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

  if (!requirePiApiKey(res)) return;

  try {
    /*
     * Vérification du paiement avant complétion.
     */
    const paymentResponse = await axios.get(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: piHeaders(),
        timeout: 15000
      }
    );

    const payment = paymentResponse.data;

    /*
     * Éviter de compléter un paiement déjà complété.
     */
    if (payment?.status?.developer_completed === true) {
      return res.json({
        success: true,
        completed: true,
        alreadyCompleted: true,
        payment
      });
    }

    /*
     * Vérifie que le paiement a bien été approuvé
     * par le serveur avant de le compléter.
     */
    if (payment?.status?.developer_approved !== true) {
      return res.status(409).json({
        success: false,
        completed: false,
        error: 'Payment has not been approved by the developer.'
      });
    }

    /*
     * Complétion auprès de Pi.
     */
    const completionResponse = await axios.post(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/complete`,
      {
        txid
      },
      {
        headers: piHeaders(),
        timeout: 15000
      }
    );

    return res.json({
      success: true,
      completed: true,
      payment: completionResponse.data
    });
  } catch (error) {
    console.error(
      'Pi payment completion error:',
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 502).json({
      success: false,
      completed: false,
      error: 'Unable to complete the Pi payment.',
      details: error.response?.data || error.message
    });
  }
});


/*
 * GET /api/payments/health
 *
 * Vérification simple de la configuration de la route.
 */
router.get('/health', (req, res) => {
  return res.json({
    success: true,
    service: 'WorldArts payments',
    piApiConfigured: Boolean(PI_API_KEY),
    piApiBaseUrl: PI_API_BASE_URL
  });
});


module.exports = router;
