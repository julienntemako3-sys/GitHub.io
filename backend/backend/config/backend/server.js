require('dotenv').config();

const express = require('express');
const cors = require('cors');

const env = require('./config/env');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WorldArts Backend is running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`WorldArts Backend running on port ${PORT}`);
});
