
const express = require('express');
const axios = require('axios');
const { verifyPiAccessToken } = require('./auth');

const router = express.Router();

const PI_API_BASE_URL = (
  process.env.PI_API_BASE_URL || 'https://api.minepi.com'
).replace(/\/$/, '');

const PI_API_KEY = process.env.PI_API_KEY;

/**
 * Vérifie que la clé serveur Pi est configurée.
 */
function requireApiKey(res) {
  if (!PI_API_KEY) {
    res.status(500).json({
      success: false,
      message: 'PI_API_KEY is not configured on the server.'
    });
    return false;
  }

  return true;
}

/**
 * Headers utilisés pour les appels Server API de Pi.
 */
function piServerHeaders() {
  return {
    Authorization: `Key ${PI_API_KEY}`,
    Accept: 'application/json'
  };
}

/**
 * Récupère un paiement Pi depuis le Server API.
 */
async function getPiPayment(paymentId) {
  const response = await axios.get(
    `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: piServerHeaders(),
      timeout: 15000,
      validateStatus: () => true
    }
  );

  if (response.status !== 200) {
    const err = new Error(
      response.data?.error ||
      response.data?.message ||
      'Impossible de récupérer le paiement Pi.'
    );

    err.status =
      response.status >= 400 && response.status < 600
        ? response.status
        : 502;

    throw err;
  }

  return response.data;
}

/**
 * Vérifie que le paiement appartient bien
 * à l'utilisateur authentifié.
 */
function assertPaymentBelongsToUser(payment, user) {
  const ownerUid =
    payment?.Pioneer_uid ||
    payment?.pioneer_uid ||
    payment?.user_uid;

  if (ownerUid && user?.uid && ownerUid !== user.uid) {
    const err = new Error(
      'Ce paiement Pi ne correspond pas à l’utilisateur authentifié.'
    );

    err.status = 403;
    throw err;
  }
}

/**
 * APPROVE
 *
 * POST /api/transactions/approve
 */
router.post('/approve', async (req, res) => {
  const { paymentId, accessToken } = req.body || {};

  if (!paymentId || !accessToken) {
    return res.status(400).json({
      success: false,
      message: 'paymentId and accessToken are required.'
    });
  }

  if (!requireApiKey(res)) return;

  try {
    // Vérification du Pioneer auprès de Pi.
    const user = await verifyPiAccessToken(accessToken);

    // Récupération du paiement.
    const payment = await getPiPayment(paymentId);

    // Vérification de propriété.
    assertPaymentBelongsToUser(payment, user);

    // Appel Pi pour approuver le paiement.
    const response = await axios.post(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/approve`,
      null,
      {
        headers: piServerHeaders(),
        timeout: 15000,
        validateStatus: () => true
      }
    );

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({
        success: false,
        message:
          response.data?.error ||
          response.data?.message ||
          'Pi payment approval failed.'
      });
    }

    return res.json({
      success: true,
      payment: response.data
    });

  } catch (error) {
    console.error(
      'Pi approve:',
      error.status || 502,
      error.response?.data || error.message
    );

    return res.status(
      error.status ||
      error.response?.status ||
      502
    ).json({
      success: false,
      message:
        error.message ||
        error.response?.data?.error ||
        'Pi payment approval failed.'
    });
  }
});

/**
 * COMPLETE
 *
 * POST /api/transactions/complete
 */
router.post('/complete', async (req, res) => {
  const {
    paymentId,
    txid,
    accessToken
  } = req.body || {};

  if (!paymentId || !txid || !accessToken) {
    return res.status(400).json({
      success: false,
      message:
        'paymentId, txid and accessToken are required.'
    });
  }

  if (!requireApiKey(res)) return;

  try {
    // Vérification de l'utilisateur.
    const user = await verifyPiAccessToken(accessToken);

    // Récupération du paiement.
    const payment = await getPiPayment(paymentId);

    // Vérification propriétaire.
    assertPaymentBelongsToUser(payment, user);

    // Si déjà terminé, inutile de le refaire.
    if (payment?.status?.developer_completed === true) {
      return res.json({
        success: true,
        payment,
        alreadyCompleted: true
      });
    }

    // Completion auprès de Pi.
    const response = await axios.post(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/complete`,
      { txid },
      {
        headers: {
          ...piServerHeaders(),
          'Content-Type': 'application/json'
        },
        timeout: 15000,
        validateStatus: () => true
      }
    );

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({
        success: false,
        message:
          response.data?.error ||
          response.data?.message ||
          'Pi payment completion failed.'
      });
    }

    return res.json({
      success: true,
      payment: response.data
    });

  } catch (error) {
    console.error(
      'Pi complete:',
      error.status || 502,
      error.response?.data || error.message
    );

    return res.status(
      error.status ||
      error.response?.status ||
      502
    ).json({
      success: false,
      message:
        error.message ||
        error.response?.data?.error ||
        'Pi payment completion failed.'
    });
  }
});

/**
 * INCOMPLETE PAYMENT
 *
 * POST /api/transactions/incomplete
 */
router.post('/incomplete', async (req, res) => {
  const {
    paymentId,
    accessToken
  } = req.body || {};

  if (!paymentId || !accessToken) {
    return res.status(400).json({
      success: false,
      message:
        'paymentId and accessToken are required.'
    });
  }

  if (!requireApiKey(res)) return;

  try {
    // Vérification de l'utilisateur.
    const user = await verifyPiAccessToken(accessToken);

    // Récupération du paiement.
    const payment = await getPiPayment(paymentId);

    // Vérification propriétaire.
    assertPaymentBelongsToUser(payment, user);

    // Déjà complété.
    if (payment?.status?.developer_completed === true) {
      return res.json({
        success: true,
        payment,
        alreadyCompleted: true
      });
    }

    // Recherche du txid.
    const txid = payment?.transaction?.txid;

    if (!txid) {
      return res.status(409).json({
        success: false,
        message:
          'Le paiement est incomplet mais aucun txid n’est encore disponible.'
      });
    }

    // Tentative de completion.
    const response = await axios.post(
      `${PI_API_BASE_URL}/v2/payments/${encodeURIComponent(paymentId)}/complete`,
      { txid },
      {
        headers: {
          ...piServerHeaders(),
          'Content-Type': 'application/json'
        },
        timeout: 15000,
        validateStatus: () => true
      }
    );

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({
        success: false,
        message:
          response.data?.error ||
          response.data?.message ||
          'Impossible de compléter le paiement incomplet.'
      });
    }

    return res.json({
      success: true,
      payment: response.data,
      completedFromIncomplete: true
    });

  } catch (error) {
    console.error(
      'Pi incomplete:',
      error.status || 502,
      error.response?.data || error.message
    );

    return res.status(
      error.status ||
      error.response?.status ||
      502
    ).json({
      success: false,
      message:
        error.message ||
        'Invalid Pi session.'
    });
  }
});

module.exports = router;
