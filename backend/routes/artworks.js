// ==========================================================
// WorldArts - routes/artworks.js
// Gallery + Artwork Marketplace
// Payments: Pi Network + WART
// ==========================================================

const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const { artworks } = require("../config/store");
const { requireAuth } = require("../middleware/auth");

// ==========================================================
// Helpers
// ==========================================================

function cleanText(value, fallback = "") {
  if (value === undefined || value === null) {
    return fallback;
  }

  return String(value).trim();
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

/*
 * Frontend WorldArts expects:
 *
 * {
 *   id,
 *   title,
 *   artist,
 *   artistName,
 *   description,
 *   imageUrl,
 *   price,
 *   currency,
 *   status,
 *   category,
 *   createdAt
 * }
 *
 * Internally we keep price as:
 *
 * { pi: Number, wart: Number }
 *
 * This allows both Pi and WART to be represented safely.
 */

function normalizeArtwork(artwork) {
  const rawPrice =
    artwork && artwork.price !== undefined
      ? artwork.price
      : 0;

  let pi = 0;
  let wart = 0;

  if (
    rawPrice &&
    typeof rawPrice === "object" &&
    !Array.isArray(rawPrice)
  ) {
    pi = toNumber(rawPrice.pi, 0);
    wart = toNumber(rawPrice.wart, 0);
  } else {
    const amount = toNumber(rawPrice, 0);

    const currency =
      cleanText(artwork.currency, "Pi").toUpperCase();

    if (currency === "WART") {
      wart = amount;
    } else {
      pi = amount;
    }
  }

  let currency = "Pi";
  let displayPrice = pi;

  if (pi > 0) {
    currency = "Pi";
    displayPrice = pi;
  } else if (wart > 0) {
    currency = "WART";
    displayPrice = wart;
  }

  const artist =
    cleanText(
      artwork.artist ||
      artwork.artistName ||
      artwork.creator ||
      ""
    );

  const imageUrl =
    cleanText(
      artwork.imageUrl ||
      artwork.image ||
      artwork.cover ||
      ""
    );

  return {
    id: cleanText(artwork.id),
    title: cleanText(artwork.title, "WorldArts Artwork"),
    artist,
    artistName: artist,

    description:
      cleanText(artwork.description),

    imageUrl,
    image: imageUrl,

    category:
      cleanText(artwork.category, "Art"),

    price: displayPrice,
    currency,

    // Keep both values available for future WART integration.
    prices: {
      pi,
      wart
    },

    status:
      cleanText(artwork.status, "published")
        .toLowerCase(),

    artistId:
      cleanText(artwork.artistId),

    createdAt:
      artwork.createdAt ||
      new Date().toISOString(),

    updatedAt:
      artwork.updatedAt ||
      new Date().toISOString()
  };
}


// ==========================================================
// Demo / initial artworks
//
// These make the Gallery visible immediately when the store
// is empty. They use Pi prices so the existing "Buy with Pi"
// flow can recognize them.
// ==========================================================

function ensureDemoArtworks() {

  if (artworks.size > 0) {
    return;
  }

  const now =
    new Date().toISOString();

  const demoArtworks = [

    {
      id: uuidv4(),
      title: "Dawn over Lake Tanganyika",
      artist: "Amara K.",
      artistName: "Amara K.",
      description:
        "A beautiful artistic vision inspired by Lake Tanganyika and the first light of the day.",
      imageUrl:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
      category: "Painting",
      price: {
        pi: 0.001,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-artist-amara",
      createdAt: now,
      updatedAt: now
    },

    {
      id: uuidv4(),
      title: "African Colors",
      artist: "Amani Studio",
      artistName: "Amani Studio",
      description:
        "A contemporary artwork celebrating African colors, culture and creativity.",
      imageUrl:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
      category: "Contemporary Art",
      price: {
        pi: 0.002,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-artist-amani",
      createdAt: now,
      updatedAt: now
    },

    {
      id: uuidv4(),
      title: "Spirit of Africa",
      artist: "Kira Arts",
      artistName: "Kira Arts",
      description:
        "An original digital artwork inspired by African heritage and modern creativity.",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=85",
      category: "Digital Art",
      price: {
        pi: 0.003,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-artist-kira",
      createdAt: now,
      updatedAt: now
    },

    {
      id: uuidv4(),
      title: "Golden Heritage",
      artist: "WorldArts Collection",
      artistName: "WorldArts Collection",
      description:
        "A premium collection piece representing heritage, beauty and artistic expression.",
      imageUrl:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=85",
      category: "Collection",
      price: {
        pi: 0.005,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "worldarts-collection",
      createdAt: now,
      updatedAt: now
    }

  ];

  for (const artwork of demoArtworks) {
    artworks.set(
      artwork.id,
      artwork
    );
  }
}


// ==========================================================
// GET /api/artworks
// Public Gallery
// ==========================================================

router.get("/", (req, res) => {

  // Ensure the Gallery is never empty on a fresh backend.
  ensureDemoArtworks();

  const status =
    cleanText(
      req.query.status,
      "published"
    ).toLowerCase();

  let result =
    Array.from(artworks.values());

  // Only published artworks are shown publicly.
  if (status !== "all") {
    result =
      result.filter(
        artwork =>
          cleanText(
            artwork.status,
            "published"
          ).toLowerCase() === status
      );
  }

  // Optional category filter.
  const category =
    cleanText(
      req.query.category
    ).toLowerCase();

  if (category) {
    result =
      result.filter(
        artwork =>
          cleanText(
            artwork.category
          ).toLowerCase() === category
      );
  }

  // Newest first.
  result.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  res.json({
    success: true,
    count: result.length,
    artworks:
      result.map(normalizeArtwork)
  });
});


// ==========================================================
// GET /api/artworks/:id
// One artwork
// ==========================================================

router.get("/:id", (req, res) => {

  ensureDemoArtworks();

  const artwork =
    artworks.get(req.params.id);

  if (!artwork) {
    return res.status(404).json({
      success: false,
      error: "Œuvre introuvable."
    });
  }

  res.json({
    success: true,
    artwork:
      normalizeArtwork(artwork)
  });
});


// ==========================================================
// POST /api/artworks
// Create artwork
// Artist authentication required
// ==========================================================

router.post("/", requireAuth, (req, res) => {

  const {
    title,
    description,
    imageUrl,
    image,
    category,
    price,
    currency,
    artist,
    artistName
  } = req.body || {};

  const cleanTitle =
    cleanText(title);

  if (!cleanTitle) {
    return res.status(400).json({
      success: false,
      error: "Le titre de l'œuvre est obligatoire."
    });
  }

  const finalImage =
    cleanText(imageUrl || image);

  if (!finalImage) {
    return res.status(400).json({
      success: false,
      error: "L'image de l'œuvre est obligatoire."
    });
  }

  // --------------------------------------------------------
  // Price
  // --------------------------------------------------------

  let pi = 0;
  let wart = 0;

  if (
    price &&
    typeof price === "object" &&
    !Array.isArray(price)
  ) {

    pi =
      toNumber(price.pi, 0);

    wart =
      toNumber(price.wart, 0);

  } else {

    const amount =
      toNumber(price, 0);

    const selectedCurrency =
      cleanText(
        currency,
        "Pi"
      ).toUpperCase();

    if (
      selectedCurrency === "WART"
    ) {
      wart = amount;
    } else {
      pi = amount;
    }
  }

  if (
    pi < 0 ||
    wart < 0 ||
    !Number.isFinite(pi) ||
    !Number.isFinite(wart)
  ) {
    return res.status(400).json({
      success: false,
      error: "Prix invalide."
    });
  }

  if (
    pi === 0 &&
    wart === 0
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Le prix doit être supérieur à zéro."
    });
  }

  if (
    pi > 0 &&
    wart > 0
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Une œuvre doit avoir un prix en Pi ou en WART."
    });
  }

  const selectedCurrency =
    pi > 0
      ? "Pi"
      : "WART";

  const now =
    new Date().toISOString();

  const artwork = {

    id:
      uuidv4(),

    title:
      cleanTitle,

    description:
      cleanText(description),

    imageUrl:
      finalImage,

    category:
      cleanText(
        category,
        "Art"
      ),

    artist:
      cleanText(
        artist ||
        artistName ||
        req.user.username ||
        "WorldArts Artist"
      ),

    artistName:
      cleanText(
        artist ||
        artistName ||
        req.user.username ||
        "WorldArts Artist"
      ),

    artistId:
      req.user.id,

    price: {
      pi,
      wart
    },

    currency:
      selectedCurrency,

    status:
      "published",

    createdAt:
      now,

    updatedAt:
      now
  };

  artworks.set(
    artwork.id,
    artwork
  );

  res.status(201).json({
    success: true,
    message:
      "Œuvre publiée avec succès.",
    artwork:
      normalizeArtwork(artwork)
  });
});


// ==========================================================
// PUT /api/artworks/:id
// Update artwork
// ==========================================================

router.put("/:id", requireAuth, (req, res) => {

  const artwork =
    artworks.get(req.params.id);

  if (!artwork) {
    return res.status(404).json({
      success: false,
      error: "Œuvre introuvable."
    });
  }

  if (
    artwork.artistId !==
    req.user.id
  ) {
    return res.status(403).json({
      success: false,
      error:
        "Vous ne pouvez pas modifier cette œuvre."
    });
  }

  const {
    title,
    description,
    imageUrl,
    image,
    category,
    price,
    currency,
    status,
    artist,
    artistName
  } = req.body || {};

  // --------------------------------------------------------
  // Basic fields
  // --------------------------------------------------------

  if (title !== undefined) {
    const cleanTitle =
      cleanText(title);

    if (!cleanTitle) {
      return res.status(400).json({
        success: false,
        error:
          "Le titre ne peut pas être vide."
      });
    }

    artwork.title =
      cleanTitle;
  }

  if (description !== undefined) {
    artwork.description =
      cleanText(description);
  }

  if (
    imageUrl !== undefined ||
    image !== undefined
  ) {
    const finalImage =
      cleanText(
        imageUrl || image
      );

    if (!finalImage) {
      return res.status(400).json({
        success: false,
        error:
          "L'image ne peut pas être vide."
      });
    }

    artwork.imageUrl =
      finalImage;
  }

  if (category !== undefined) {
    artwork.category =
      cleanText(
        category,
        "Art"
      );
  }

  if (
    artist !== undefined ||
    artistName !== undefined
  ) {
    const newArtist =
      cleanText(
        artist ||
        artistName
      );

    if (newArtist) {
      artwork.artist =
        newArtist;

      artwork.artistName =
        newArtist;
    }
  }

  // --------------------------------------------------------
  // Status
  // --------------------------------------------------------

  if (status !== undefined) {

    const allowedStatuses = [
      "published",
      "draft",
      "sold",
      "hidden"
    ];

    const cleanStatus =
      cleanText(
        status
      ).toLowerCase();

    if (
      !allowedStatuses.includes(
        cleanStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Statut invalide."
      });
    }

    artwork.status =
      cleanStatus;
  }

  // --------------------------------------------------------
  // Price
  // --------------------------------------------------------

  if (
    price !== undefined ||
    currency !== undefined
  ) {

    let pi = 0;
    let wart = 0;

    if (
      price &&
      typeof price === "object" &&
      !Array.isArray(price)
    ) {

      pi =
        toNumber(price.pi, 0);

      wart =
        toNumber(price.wart, 0);

    } else {

      const amount =
        toNumber(
          price !== undefined
            ? price
            : 0,
          0
        );

      const selectedCurrency =
        cleanText(
          currency,
          artwork.currency || "Pi"
        ).toUpperCase();

      if (
        selectedCurrency === "WART"
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
        error:
          "Prix invalide."
      });
    }

    if (
      pi === 0 &&
      wart === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Le prix doit être supérieur à zéro."
      });
    }

    if (
      pi > 0 &&
      wart > 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Une œuvre doit avoir un prix en Pi ou en WART."
      });
    }

    artwork.price = {
      pi,
      wart
    };

    artwork.currency =
      pi > 0
        ? "Pi"
        : "WART";
  }

  artwork.updatedAt =
    new Date().toISOString();

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
// Delete artwork
// ==========================================================

router.delete("/:id", requireAuth, (req, res) => {

  const artwork =
    artworks.get(req.params.id);

  if (!artwork) {
    return res.status(404).json({
      success: false,
      error:
        "Œuvre introuvable."
    });
  }

  if (
    artwork.artistId !==
    req.user.id
  ) {
    return res.status(403).json({
      success: false,
      error:
        "Vous ne pouvez pas supprimer cette œuvre."
    });
  }

  artworks.delete(
    req.params.id
  );

  res.json({
    success: true,
    message:
      "Œuvre supprimée avec succès."
  });
});


// ==========================================================
// Export
// ==========================================================

module.exports = router;
