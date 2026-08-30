// routes/artworks.js
//
// WorldArts — Artwork API
// Compatible avec:
// - config/store.js
// - middleware/auth.js
// - server.js
// - frontend/script.js
//
// Stockage actuel : mémoire (Map)
// Plus tard : Supabase / PostgreSQL

const express = require('express');

const router = express.Router();

const {
  artworks,
  uuidv4
} = require('../config/store');

const {
  requireAuth,
  optionalAuth
} = require('../middleware/auth');


// ==========================================================
// HELPERS
// ==========================================================

function normalizeArtwork(artwork) {

  if (!artwork) {
    return null;
  }

  const priceObject =
    artwork.price &&
    typeof artwork.price === 'object'
      ? artwork.price
      : {
          pi: Number(artwork.price || 0),
          wart: 0
        };

  const piPrice = Number(priceObject.pi || 0);
  const wartPrice = Number(priceObject.wart || 0);

  let price = '';
  let currency = '';

  if (piPrice > 0) {
    price = piPrice;
    currency = 'Pi';
  } else if (wartPrice > 0) {
    price = wartPrice;
    currency = 'WART';
  }

  return {
    id: artwork.id,
    title: artwork.title || '',
    description: artwork.description || '',
    artistId: artwork.artistId || '',
    artist: artwork.artist || artwork.artistName || '',
    artistName: artwork.artistName || artwork.artist || '',
    price,
    currency,
    prices: {
      pi: piPrice,
      wart: wartPrice
    },
    imageUrl: artwork.imageUrl || '',
    views: Number(artwork.views || 0),
    likes: Number(artwork.likes || 0),
    status: artwork.status || 'published',
    createdAt: artwork.createdAt || null
  };
}


// ==========================================================
// GET /api/artworks
// Liste des œuvres publiées
// ==========================================================

router.get('/', optionalAuth, (req, res) => {

  const list = [];

  for (const artwork of artworks.values()) {

    if (
      artwork.status &&
      artwork.status !== 'published'
    ) {
      continue;
    }

    list.push(
      normalizeArtwork(artwork)
    );
  }

  // Plus récent en premier
  list.sort(
    (a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
  );

  res.json({
    success: true,
    artworks: list,
    count: list.length
  });

});


// ==========================================================
// GET /api/artworks/:id
// Une œuvre
// ==========================================================

router.get('/:id', optionalAuth, (req, res) => {

  const artwork =
    artworks.get(req.params.id);

  if (!artwork) {

    return res.status(404).json({
      success: false,
      error: 'Œuvre introuvable.'
    });

  }

  // Une œuvre non publiée n'est visible que par son propriétaire
  if (
    artwork.status !== 'published' &&
    (!req.user ||
      artwork.artistId !== req.user.id)
  ) {

    return res.status(404).json({
      success: false,
      error: 'Œuvre introuvable.'
    });

  }

  // Compteur de vues
  artwork.views =
    Number(artwork.views || 0) + 1;

  artworks.set(
    artwork.id,
    artwork
  );

  res.json({
    success: true,
    artwork: normalizeArtwork(artwork)
  });

});


// ==========================================================
// POST /api/artworks
// Créer une œuvre
// ==========================================================

router.post('/', requireAuth, (req, res) => {

  const {
    title,
    description,
    price,
    currency,
    imageUrl,
    status
  } = req.body || {};


  if (!title || !String(title).trim()) {

    return res.status(400).json({
      success: false,
      error: 'Le titre de l’œuvre est requis.'
    });

  }


  // --------------------------------------------------------
  // Prix
  // --------------------------------------------------------

  let pi = 0;
  let wart = 0;

  if (
    price &&
    typeof price === 'object'
  ) {

    pi = Number(price.pi || 0);
    wart = Number(price.wart || 0);

  } else {

    const amount =
      Number(price || 0);

    const selectedCurrency =
      String(currency || 'Pi')
        .trim()
        .toUpperCase();

    if (selectedCurrency === 'WART') {
      wart = amount;
    } else {
      pi = amount;
    }

  }


  if (
    !Number.isFinite(pi) ||
    !Number.isFinite(wart) ||
    pi < 0 ||
    wart < 0
  ) {

    return res.status(400).json({
      success: false,
      error: 'Prix invalide.'
    });

  }


  if (pi === 0 && wart === 0) {

    return res.status(400).json({
      success: false,
      error: 'Le prix doit être supérieur à zéro.'
    });

  }


  // --------------------------------------------------------
  // Une œuvre doit utiliser Pi OU WART
  // --------------------------------------------------------

  if (pi > 0 && wart > 0) {

    return res.status(400).json({
      success: false,
      error: 'Une œuvre doit avoir un prix en Pi ou en WART.'
    });

  }


  const artworkId =
    uuidv4();


  const artwork = {

    id: artworkId,

    title:
      String(title).trim(),

    description:
      String(description || '').trim(),

    artistId:
      req.user.id,

    price: {
      pi,
      wart
    },

    imageUrl:
      String(imageUrl || '').trim(),

    views: 0,

    likes: 0,

    status:
      status === 'draft'
        ? 'draft'
        : 'published',

    createdAt:
      new Date().toISOString()

  };


  artworks.set(
    artworkId,
    artwork
  );


  res.status(201).json({
    success: true,
    artwork: normalizeArtwork(artwork)
  });

});


// ==========================================================
// PUT /api/artworks/:id
// Modifier une œuvre
// ==========================================================

router.put('/:id', requireAuth, (req, res) => {

  const artwork =
    artworks.get(req.params.id);


  if (!artwork) {

    return res.status(404).json({
      success: false,
      error: 'Œuvre introuvable.'
    });

  }


  if (
    artwork.artistId !== req.user.id
  ) {

    return res.status(403).json({
      success: false,
      error:
        'Vous ne pouvez pas modifier cette œuvre.'
    });

  }


  const {
    title,
    description,
    price,
    currency,
    imageUrl,
    status
  } = req.body || {};


  if (
    title !== undefined
  ) {

    const cleanTitle =
      String(title).trim();

    if (!cleanTitle) {

      return res.status(400).json({
        success: false,
        error: 'Le titre ne peut pas être vide.'
      });

    }

    artwork.title =
      cleanTitle;

  }


  if (
    description !== undefined
  ) {

    artwork.description =
      String(description).trim();

  }


  if (
    imageUrl !== undefined
  ) {

    artwork.imageUrl =
      String(imageUrl).trim();

  }


  if (
    status !== undefined
  ) {

    if (
      !['draft', 'published'].includes(
        status
      )
    ) {

      return res.status(400).json({
        success: false,
        error: 'Statut invalide.'
      });

    }

    artwork.status =
      status;

  }


  // --------------------------------------------------------
  // Mise à jour du prix
  // --------------------------------------------------------

  if (
    price !== undefined ||
    currency !== undefined
  ) {

    let pi = 0;
    let wart = 0;


    if (
      price &&
      typeof price === 'object'
    ) {

      pi =
        Number(price.pi || 0);

      wart =
        Number(price.wart || 0);

    } else {

      const amount =
        Number(price || 0);

      const selectedCurrency =
        String(currency || 'Pi')
          .trim()
          .toUpperCase();

      if (
        selectedCurrency === 'WART'
      ) {

        wart = amount;

      } else {

        pi = amount;

      }

    }


    if (
      !Number.isFinite(pi) ||
      !Number.isFinite(wart) ||
      pi < 0 ||
      wart < 0
    ) {

      return res.status(400).json({
        success: false,
        error: 'Prix invalide.'
      });

    }


    if (
      pi === 0 &&
      wart === 0
    ) {

      return res.status(400).json({
        success: false,
        error: 'Le prix doit être supérieur à zéro.'
      });

    }


    if (
      pi > 0 &&
      wart > 0
    ) {

      return res.status(400).json({
        success: false,
        error:
          'Une œuvre doit avoir un prix en Pi ou en WART.'
      });

    }


    artwork.price = {
      pi,
      wart
    };

  }


  artworks.set(
    artwork.id,
    artwork
  );


  res.json({
    success: true,
    artwork:
      normalizeArtwork(artwork)
  });

});


// ==========================================================
// DELETE /api/artworks/:id
// Supprimer une œuvre
// ==========================================================

router.delete('/:id', requireAuth, (req, res) => {

  const artwork =
    artworks.get(req.params.id);


  if (!artwork) {

    return res.status(404).json({
      success: false,
      error: 'Œuvre introuvable.'
    });

  }


  if (
    artwork.artistId !== req.user.id
  ) {

    return res.status(403).json({
      success: false,
      error:
        'Vous ne pouvez pas supprimer cette œuvre.'
    });

  }


  artworks.delete(
    req.params.id
  );


  res.json({
    success: true,
    message: 'Œuvre supprimée.'
  });

});


module.exports = router;
