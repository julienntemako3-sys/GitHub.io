require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const paymentsRouter = require('./routes/payments');
const artworksRouter = require('./routes/artworks');
const artistsRouter = require('./routes/artists');
const contactsRouter = require('./routes/contacts');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ success: true, service: 'WorldArts backend', status: 'running' });
});

app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/artworks', artworksRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/contact', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WorldArts backend listening on port ${PORT}`);
});

module.exports = app;
