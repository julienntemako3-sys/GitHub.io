
// routes/artworks.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { artworks, artists, uuidv4 } = require('../config/store');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/artworks
 * Liste publique des œuvres
 * Filtres:
 * ?artistId=
 * ?minPi=
 * ?maxPi=
 * ?q=
 */
router.get('/', optionalAuth, (req, res) => {
  let list = Array.from(artworks.values());

  const { artistId, minPi, maxPi, q } = req.query;

  if (artistId) {
    list = list.filter(a => a.artistId === artistId);
  }

  if (minPi) {
    list = list.filter(a => a.price.pi >= Number(minPi));
  }

  if (maxPi) {
    list = list.filter(a => a.price.pi <= Number(maxPi));
  }

  if (q) {
    const query = q.toLowerCase();

    list = list.filter(a =>
      (a.title || '').toLowerCase().includes(query) ||
      (a.description || '').toLowerCase().includes(query)
    );
  }

  res.json({ artworks: list });
});


/**
 * GET /api/artworks/:id
 */
router.get('/:id', (req, res) => {
  const artwork = artworks.get(req.params.id);

  if (!artwork) {
    return res.status(404).json({
      error: 'Œuvre introuvable.'
    });
  }

  res.json({ artwork });
});


/**
 * POST /api/artworks
 * Création d'une œuvre
 */
router.post(
  '/',
  requireAuth,
  [
    body('title').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('artistId').isString().notEmpty(),
    body('price.pi').isFloat({ min: 0.001 }),
    body('price.wart').isFloat({ min: 0 })
  ],
  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error:'Champs invalides.',
        details: errors.array()
      });
    }


    const {
      title,
      description,
      artistId,
      price,
      imageUrl
    } = req.body;


    if (!artists.get(artistId)) {
      return res.status(400).json({
        error:'Artiste introuvable.'
      });
    }


    if (req.user.id !== artistId) {
      return res.status(403).json({
        error:"Vous ne pouvez pas publier au nom d'un autre artiste."
      });
    }


    const id = uuidv4();


    const artwork = {
      id,
      title,
      description,
      artistId,

      price:{
        pi:Number(price.pi),
        wart:Number(price.wart)
      },

      imageUrl:imageUrl || '',

      views:0,
      likes:0,

      status:'published',

      createdAt:new Date().toISOString()
    };


    artworks.set(id, artwork);


    res.status(201).json({
      artwork
    });
  }
);



/**
 * PUT /api/artworks/:id
 * Modifier une œuvre
 */
router.put('/:id', requireAuth, (req,res)=>{

  const artwork = artworks.get(req.params.id);


  if(!artwork){
    return res.status(404).json({
      error:'Œuvre introuvable.'
    });
  }


  if(artwork.artistId !== req.user.id){
    return res.status(403).json({
      error:'Action non autorisée.'
    });
  }


  const {
    title,
    description,
    price,
    imageUrl
  } = req.body;


  if(title !== undefined)
    artwork.title = title;


  if(description !== undefined)
    artwork.description = description;


  if(price){
    artwork.price.pi = Number(price.pi ?? artwork.price.pi);
    artwork.price.wart = Number(price.wart ?? artwork.price.wart);
  }


  if(imageUrl !== undefined)
    artwork.imageUrl = imageUrl;


  artworks.set(
    artwork.id,
    artwork
  );


  res.json({
    artwork
  });

});



/**
 * DELETE /api/artworks/:id
 */
router.delete('/:id', requireAuth, (req,res)=>{

  const artwork = artworks.get(req.params.id);


  if(!artwork){
    return res.status(404).json({
      error:'Œuvre introuvable.'
    });
  }


  if(artwork.artistId !== req.user.id){
    return res.status(403).json({
      error:'Vous ne pouvez pas supprimer cette œuvre.'
    });
  }


  artworks.delete(req.params.id);


  res.json({
    success:true
  });

});


module.exports = router;
