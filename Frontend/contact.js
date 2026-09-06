
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  console.log('[WorldArts contact]', {
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString()
  });

  return res.status(201).json({ success: true, message: 'Message received.' });
});

module.exports = router;
