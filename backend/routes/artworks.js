const express = require('express');
const router = express.Router();

const artworks = [
  {
    id: 'demo-1',
    title: 'Aube sur le lac Tanganyika',
    artist: 'Amara K.',
    price: 0.001,
    currency: 'Pi',
    imageUrl: ''
  },
  {
    id: 'demo-2',
    title: 'Culture du Burundi',
    artist: 'WorldArts Artist',
    price: 0.002,
    currency: 'Pi',
    imageUrl: ''
  },
  {
    id: 'demo-3',
    title: 'Couleurs d’Afrique de l’Est',
    artist: 'WorldArts Artist',
    price: 0.003,
    currency: 'Pi',
    imageUrl: ''
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, artworks });
});

module.exports = router;
