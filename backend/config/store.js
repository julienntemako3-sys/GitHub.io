
// config/store.js
//
// Stockage EN MÉMOIRE pour démarrage rapide.
// À remplacer plus tard par Supabase/PostgreSQL/Firebase.
//

const { v4: uuidv4 } = require('uuid');


// --- Données principales ---

const users = new Map();
// uid Pi -> user


const artworks = new Map();
// id -> artwork


const artists = new Map();
// id -> artist


const payments = new Map();
// paymentId -> payment




// --- Données de démonstration ---

function seed() {


  const demoUserId = uuidv4();


  users.set(demoUserId, {

    id: demoUserId,

    uid: 'pi_demo_user',

    username:'demo_artist',

    roles:['artist'],

    createdAt:new Date().toISOString()

  });



  const artistId = uuidv4();



  artists.set(artistId, {

    id:artistId,

    ownerId:demoUserId,

    name:'Amina K.',

    bio:
    'Artiste peintre basée à Bujumbura, spécialisée dans l’art contemporain africain.',

    country:'Burundi',

    avatarUrl:'',

    createdAt:new Date().toISOString()

  });




  const artworkId = uuidv4();



  artworks.set(artworkId, {


    id:artworkId,


    title:'Racines',


    description:
    'Peinture acrylique sur toile, 60x80cm.',


    artistId,



    price:{

      pi:25,

      wart:0

    },



    imageUrl:'',


    views:0,


    likes:0,


    status:'published',


    createdAt:new Date().toISOString()


  });


}


seed();



module.exports = {

  users,

  artworks,

  artists,

  payments,

  uuidv4

};
