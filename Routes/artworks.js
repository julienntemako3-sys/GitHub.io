// routes/artworks.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { artworks, uuidv4 } = require('../config/store');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/artworks
 * Liste publique des œuvres
 */
router.get('/', optionalAuth, (req, res) => {
  const { artistId, minPi, maxPi, q } = req.query;

  let results = Array.from(artworks.values());

  if (artistId) {
    results = results.filter(
      (artwork) => artwork.artistId === artistId
    );
  }

  if (minPi) {
    results = results.filter(
      (artwork) => Number(artwork.price?.pi || 0) >= Number(minPi)
    );
  }

  if (maxPi) {
    results = results.filter(
      (artwork) => Number(artwork.price?.pi || 0) <= Number(maxPi)
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

/**
 * GET /api/artworks/:id
 * Voir une œuvre
 */
router.get('/:id', (req, res) => {
  const artwork = artworks.get(req.params.id);

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

/**
 * POST /api/artworks
 * Ajouter une œuvre
 */
router.post(
  '/',
  requireAuth,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('pricePi')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('pricePi must be a positive number'),

    body('priceWart')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('priceWart must be a positive number')
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

      price: {
        pi: Number(req.body.pricePi || 0),
        wart: Number(req.body.priceWart || 0)
      },

      views: 0,
      likes: 0,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    artworks.set(artwork.id, artwork);

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      artwork
    });
  }
);

module.exports = router;
