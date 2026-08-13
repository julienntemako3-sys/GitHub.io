// routes/artists.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const { artists, artworks, uuidv4 } = require('../config/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();



/**
 * GET /api/artists
 * Liste publique des artistes
 */
router.get('/', (req, res) => {

  res.json({
    artists: Array.from(artists.values())
  });

});



/**
 * GET /api/artists/:id
 * Profil artiste + ses œuvres
 */
router.get('/:id', (req,res)=>{

  const artist = artists.get(req.params.id);


  if(!artist){
    return res.status(404).json({
      error:'Artiste introuvable.'
    });
  }


  const works = Array.from(artworks.values())
    .filter(a => a.artistId === artist.id);


  res.json({
    artist,
    artworks: works
  });

});



/**
 * POST /api/artists
 * Création d'un profil artiste
 */
router.post(
  '/',
  requireAuth,
  [
    body('name')
      .isString()
      .notEmpty(),

    body('bio')
      .optional()
      .isString()
  ],

(req,res)=>{


  const errors = validationResult(req);


  if(!errors.isEmpty()){

    return res.status(400).json({
      error:'Champs invalides.',
      details:errors.array()
    });

  }



  const {
    name,
    bio,
    country,
    avatarUrl
  } = req.body;



  const id = uuidv4();



  const artist = {

    id,

    ownerId:req.user.id,

    name,

    bio:bio || '',

    country:country || '',

    avatarUrl:avatarUrl || '',

    createdAt:new Date().toISOString()

  };



  artists.set(id,artist);



  res.status(201).json({
    artist
  });


});




/**
 * PUT /api/artists/:id
 * Modifier son profil artiste
 */
router.put('/:id', requireAuth,(req,res)=>{


  const artist = artists.get(req.params.id);



  if(!artist){

    return res.status(404).json({
      error:'Artiste introuvable.'
    });

  }



  if(artist.ownerId !== req.user.id){

    return res.status(403).json({
      error:'Action non autorisée.'
    });

  }



  const {
    name,
    bio,
    country,
    avatarUrl
  } = req.body;



  if(name !== undefined)
    artist.name = name;


  if(bio !== undefined)
    artist.bio = bio;


  if(country !== undefined)
    artist.country = country;


  if(avatarUrl !== undefined)
    artist.avatarUrl = avatarUrl;



  artists.set(
    artist.id,
    artist
  );



  res.json({
    artist
  });


});




/**
 * DELETE /api/artists/:id
 * Supprimer son profil artiste
 */
router.delete('/:id', requireAuth,(req,res)=>{


  const artist = artists.get(req.params.id);



  if(!artist){

    return res.status(404).json({
      error:'Artiste introuvable.'
    });

  }



  if(artist.ownerId !== req.user.id){

    return res.status(403).json({
      error:'Vous ne pouvez pas supprimer cet artiste.'
    });

  }



  // Supprime aussi ses œuvres
  for(const [id, artwork] of artworks.entries()){

    if(artwork.artistId === artist.id){

      artworks.delete(id);

    }

  }



  artists.delete(artist.id);



  res.json({
    success:true
  });


});



module.exports = router;
