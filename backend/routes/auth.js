const express = require('express');
const axios = require('axios');

const router = express.Router();
const PI_API_BASE_URL = (process.env.PI_API_BASE_URL || 'https://api.minepi.com').replace(/\/$/, '');

async function verifyPiAccessToken(accessToken) {
  if (!accessToken) {
    const err = new Error('Pi accessToken is required.');
    err.status = 400;
    throw err;
  }

  // IMPORTANT: /v2/me is authenticated with the Pioneer Bearer token only.
  const response = await axios.get(`${PI_API_BASE_URL}/v2/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    },
    timeout: 15000,
    validateStatus: () => true
  });

  if (response.status !== 200 || !response.data || !response.data.uid) {
    const err = new Error(
      response.data?.error ||
      response.data?.message ||
      'Pi access token invalide ou expiré.'
    );
    err.status = response.status >= 400 && response.status < 600 ? response.status : 502;
    throw err;
  }

  return response.data;
}

router.post('/pi', async (req, res) => {
  try {
    const { accessToken } = req.body || {};
    const piUser = await verifyPiAccessToken(accessToken);

    // uid/username received from the browser are NOT trusted.
    // The verified /v2/me response is the source of truth.
    return res.json({
      success: true,
      user: {
        uid: piUser.uid,
        username: piUser.username || null
      }
    });
  } catch (error) {
    console.error('Pi auth verification:', error.status || 502, error.message);
    return res.status(error.status || 502).json({
      success: false,
      message: error.message || 'Pi authentication verification failed.'
    });
  }
});

module.exports = router;
module.exports.verifyPiAccessToken = verifyPiAccessToken
