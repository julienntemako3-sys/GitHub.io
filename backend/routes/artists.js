const express = require('express');
const router = express.Router();

const artists = [
  {
    id: 'artist-1',
    name: 'Amara K.',
    country: 'Burundi',
    bio: 'Artiste peintre inspirée par les paysages du lac Tanganyika.',
    avatarUrl: ''
  },
  {
    id: 'artist-2',
    name: 'WorldArts Artist',
    country: 'Afrique de l\'Est',
    bio: 'Collectif d\'artistes mettant en avant la culture est-africaine.',
    avatarUrl: ''
  },
  {
    id: 'artist-3',
    name: 'Nkurunziza J.',
    country: 'Burundi',
    bio: 'Sculpteur et artiste digital, membre de la communauté WorldArts.',
    avatarUrl: ''
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, artists });
});

router.get('/:id', (req, res) => {
  const artist = artists.find((a) => a.id === req.params.id);

  if (!artist) {
    return res.status(404).json({ success: false, error: 'Artist not found' });
  }

  return res.json({ success: true, artist });
});

module.exports = router;
