// routes/artworks.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { artworks, artists, uuidv4 } = require('../config/store');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/artworks
// Liste publique des œuvres
router.get('/', optionalAuth, (req, res) => {
  const { artistId, minPi, maxPi, q } = req.query;

  let results = [...artworks];

  if (artistId) {
    results = results.filter((artwork) => artwork.artistId === artistId);
  }

  if (minPi) {
    results = results.filter(
      (artwork) => Number(artwork.pricePi) >= Number(minPi)
    );
  }

  if (maxPi) {
    results = results.filter(
      (artwork) => Number(artwork.pricePi) <= Number(maxPi)
    );
  }

  if (q) {
    const search = q.toLowerCase();

    results = results.filter((artwork) => {
      return (
        artwork.title?.toLowerCase().includes(search) ||
        artwork.description?.toLowerCase().includes(search)
      );
    });
  }

  res.json({
    success: true,
    count: results.length,
    artworks: results
  });
});

// GET /api/artworks/:id
// Voir une œuvre
router.get('/:id', (req, res) => {
  const artwork = artworks.find((item) => item.id === req.params.id);

  if (!artwork) {
    return res.status(404).json({
      success: false,
      message: 'Artwork not found'
    });
  }

  res.json({
    success: true,
    artwork
  });
});

// POST /api/artworks
// Ajouter une œuvre
router.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('pricePi')
      .isFloat({ min: 0 })
      .withMessage('pricePi must be a positive number')
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const artwork = {
      id: uuidv4(),
      artistId: req.user.id,
      title: req.body.title,
      description: req.body.description || '',
      imageUrl: req.body.imageUrl || '',
      pricePi: Number(req.body.pricePi),
      priceWart: Number(req.body.priceWart || 0),
      createdAt: new Date().toISOString()
    };

    artworks.push(artwork);

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      artwork
    });
  }
);

module.exports = router;
