const express = require("express");

const router = express.Router();

const { artworks } = require("../config/store");
const { requireAuth } = require("../middleware/auth");

// ==========================================================
// HELPERS
// ==========================================================

function text(value, fallback = "") {
  if (value === undefined || value === null) {
    return fallback;
  }

  return String(value).trim();
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function newId() {
  return (
    "art_" +
    Date.now() +
    "_" +
    Math.random().toString(36).substring(2, 10)
  );
}

// ==========================================================
// FORMAT ARTWORK FOR FRONTEND
// ==========================================================

function formatArtwork(item) {
  let pi = 0;
  let wart = 0;

  if (
    item.price &&
    typeof item.price === "object"
  ) {
    pi = number(item.price.pi);
    wart = number(item.price.wart);
  } else {
    const amount = number(item.price);

    if (
      text(item.currency, "Pi").toUpperCase() === "WART"
    ) {
      wart = amount;
    } else {
      pi = amount;
    }
  }

  const artist = text(
    item.artist ||
    item.artistName ||
    "WorldArts Artist"
  );

  const image = text(
    item.imageUrl ||
    item.image ||
    item.cover
  );

  let price = pi;
  let currency = "Pi";

  if (pi <= 0 && wart > 0) {
    price = wart;
    currency = "WART";
  }

  return {
    id: text(item.id),
    title: text(item.title, "WorldArts Artwork"),
    artist,
    artistName: artist,
    description: text(item.description),
    imageUrl: image,
    image,
    category: text(item.category, "Art"),
    price,
    currency,
    prices: {
      pi,
      wart
    },
    status: text(item.status, "published").toLowerCase(),
    artistId: text(item.artistId),
    createdAt:
      item.createdAt ||
      new Date().toISOString(),
    updatedAt:
      item.updatedAt ||
      new Date().toISOString()
  };
}

// ==========================================================
// DEMO ARTWORKS
// ==========================================================

function createDemoArtworks() {
  if (artworks.size > 0) {
    return;
  }

  const now = new Date().toISOString();

  const list = [
    {
      id: newId(),
      title: "Dawn over Lake Tanganyika",
      artist: "Amara K.",
      artistName: "Amara K.",
      description:
        "Artwork inspired by Lake Tanganyika and African creativity.",
      imageUrl:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
      category: "Painting",
      price: {
        pi: 0.001,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-amara",
      createdAt: now,
      updatedAt: now
    },

    {
      id: newId(),
      title: "African Colors",
      artist: "Amani Studio",
      artistName: "Amani Studio",
      description:
        "Contemporary artwork celebrating African colors and culture.",
      imageUrl:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
      category: "Contemporary Art",
      price: {
        pi: 0.002,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-amani",
      createdAt: now,
      updatedAt: now
    },

    {
      id: newId(),
      title: "Spirit of Africa",
      artist: "Kira Arts",
      artistName: "Kira Arts",
      description:
        "Digital artwork inspired by African heritage.",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=85",
      category: "Digital Art",
      price: {
        pi: 0.003,
        wart: 0
      },
      currency: "Pi",
      status: "published",
      artistId: "demo-kira",
      createdAt: now,
      updatedAt: now
    }
  ];

  list.forEach((item) => {
    artworks.set(item.id, item);
  });
}

// ==========================================================
// GET ALL
// GET /api/artworks
// ==========================================================

router.get("/", (req, res) => {
  try {
    createDemoArtworks();

    let result = Array.from(
      artworks.values()
    );

    const status = text(
      req.query.status,
      "published"
    ).toLowerCase();

    if (status !== "all") {
      result = result.filter(
        (item) =>
          text(
            item.status,
            "published"
          ).toLowerCase() === status
      );
    }

    const category = text(
      req.query.category
    ).toLowerCase();

    if (category) {
      result = result.filter(
        (item) =>
          text(
            item.category
          ).toLowerCase() === category
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      artworks: result.map(formatArtwork)
    });

  } catch (error) {
    console.error(
      "ARTWORKS GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Gallery error"
    });
  }
});

// ==========================================================
// GET ONE
// GET /api/artworks/:id
// ==========================================================

router.get("/:id", (req, res) => {
  try {
    createDemoArtworks();

    const item = artworks.get(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Artwork not found"
      });
    }

    return res.status(200).json({
      success: true,
      artwork: formatArtwork(item)
    });

  } catch (error) {
    console.error(
      "ARTWORK GET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

// ==========================================================
// CREATE
// POST /api/artworks
// ==========================================================

router.post(
  "/",
  requireAuth,
  (req, res) => {
    try {
      const body = req.body || {};

      const title = text(body.title);

      const image = text(
        body.imageUrl ||
        body.image
      );

      if (!title) {
        return res.status(400).json({
          success: false,
          error: "Title is required"
        });
      }

      if (!image) {
        return res.status(400).json({
          success: false,
          error: "Image is required"
        });
      }

      let pi = 0;
      let wart = 0;

      if (
        body.price &&
        typeof body.price === "object"
      ) {
        pi = number(
          body.price.pi
        );

        wart = number(
          body.price.wart
        );
      } else {
        const amount = number(
          body.price
        );

        if (
          text(
            body.currency,
            "Pi"
          ).toUpperCase() === "WART"
        ) {
          wart = amount;
        } else {
          pi = amount;
        }
      }

      if (pi < 0 || wart < 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid price"
        });
      }

      if (
        pi === 0 &&
        wart === 0
      ) {
        return res.status(400).json({
          success: false,
          error: "Price is required"
        });
      }

      if (
        pi > 0 &&
        wart > 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Use Pi or WART, not both"
        });
      }

      const username =
        req.user &&
        req.user.username
          ? req.user.username
          : "WorldArts Artist";

      const userId =
        req.user &&
        req.user.id
          ? req.user.id
          : "unknown";

      const now =
        new Date().toISOString();

      const artwork = {
        id: newId(),

        title,

        description:
          text(body.description),

        imageUrl: image,
        image,

        category:
          text(
            body.category,
            "Art"
          ),

        artist:
          text(
            body.artist ||
            body.artistName,
            username
          ),

        artistName:
          text(
            body.artist ||
            body.artistName,
            username
          ),

        artistId: userId,

        price: {
          pi,
          wart
        },

        currency:
          pi > 0
            ? "Pi"
            : "WART",

        status:
          "published",

        createdAt: now,
        updatedAt: now
      };

      artworks.set(
        artwork.id,
        artwork
      );

      return res.status(201).json({
        success: true,
        artwork:
          formatArtwork(
            artwork
          )
      });

    } catch (error) {
      console.error(
        "ARTWORK CREATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Unable to create artwork"
      });
    }
  }
);

// ==========================================================
// UPDATE
// PUT /api/artworks/:id
// ==========================================================

router.put(
  "/:id",
  requireAuth,
  (req, res) => {
    try {
      const artwork =
        artworks.get(
          req.params.id
        );

      if (!artwork) {
        return res.status(404).json({
          success: false,
          error: "Artwork not found"
        });
      }

      if (
        artwork.artistId !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          error: "Not authorized"
        });
      }

      const body =
        req.body || {};

      if (
        body.title !== undefined
      ) {
        artwork.title =
          text(body.title);

        if (!artwork.title) {
          return res.status(400).json({
            success: false,
            error: "Title cannot be empty"
          });
        }
      }

      if (
        body.description !==
        undefined
      ) {
        artwork.description =
          text(
            body.description
          );
      }

      if (
        body.imageUrl !==
          undefined ||
        body.image !==
          undefined
      ) {
        const image =
          text(
            body.imageUrl ||
            body.image
          );

        if (!image) {
          return res.status(400).json({
            success: false,
            error: "Image cannot be empty"
          });
        }

        artwork.imageUrl =
          image;

        artwork.image =
          image;
      }

      if (
        body.category !==
        undefined
      ) {
        artwork.category =
          text(
            body.category,
            "Art"
          );
      }

      if (
        body.status !==
        undefined
      ) {
        const allowed = [
          "published",
          "draft",
          "sold",
          "hidden"
        ];

        const status =
          text(
            body.status
          ).toLowerCase();

        if (
          !allowed.includes(
            status
          )
        ) {
          return res.status(400).json({
            success: false,
            error: "Invalid status"
          });
        }

        artwork.status =
          status;
      }

      if (
        body.price !==
          undefined ||
        body.currency !==
          undefined
      ) {
        let pi = 0;
        let wart = 0;

        if (
          body.price &&
          typeof body.price ===
            "object"
        ) {
          pi = number(
            body.price.pi
          );

          wart = number(
            body.price.wart
          );
        } else {
          const amount =
            number(
              body.price
            );

          const currency =
            text(
              body.currency,
              artwork.currency ||
                "Pi"
            ).toUpperCase();

          if (
            currency === "WART"
          ) {
            wart = amount;
          } else {
            pi = amount;
          }
        }

        if (
          pi <= 0 &&
          wart <= 0
        ) {
          return res.status(400).json({
            success: false,
            error: "Invalid price"
          });
        }

        if (
          pi > 0 &&
          wart > 0
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Use Pi or WART, not both"
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

      return res.status(200).json({
        success: true,
        artwork:
          formatArtwork(
            artwork
          )
      });

    } catch (error) {
      console.error(
        "ARTWORK UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Unable to update artwork"
      });
    }
  }
);

// ==========================================================
// DELETE
// DELETE /api/artworks/:id
// ==========================================================

router.delete(
  "/:id",
  requireAuth,
  (req, res) => {
    try {
      const artwork =
        artworks.get(
          req.params.id
        );

      if (!artwork) {
        return res.status(404).json({
          success: false,
          error: "Artwork not found"
        });
      }

      if (
        artwork.artistId !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          error: "Not authorized"
        });
      }

      artworks.delete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Artwork deleted"
      });

    } catch (error) {
      console.error(
        "ARTWORK DELETE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Unable to delete artwork"
      });
    }
  }
);

// ==========================================================
// EXPORT
// ==========================================================

module.exports = router;
