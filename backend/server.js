require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const paymentsRoutes = require('./routes/payments');
const artworksRoutes = require('./routes/artworks');
const artistsRoutes = require('./routes/artists');
const contactRoutes = require('./routes/contact');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

/*
|--------------------------------------------------------------------------
| Basic application configuration
|--------------------------------------------------------------------------
*/

app.disable('x-powered-by');

// Important for Render / reverse proxy
app.set('trust proxy', 1);

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin (health checks, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');

      // If FRONTEND_URLS is not configured, allow temporarily.
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(cleanOrigin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origine non autorisée par CORS : ${origin}`)
      );
    },

    methods: ['GET', 'POST', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: false,

    optionsSuccessStatus: 204
  })
);

/*
|--------------------------------------------------------------------------
| Body parser
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '100kb'
  })
);

/*
|--------------------------------------------------------------------------
| Rate limiting
|--------------------------------------------------------------------------
*/

const rateLimitWindow =
  Number(process.env.RATE_LIMIT_WINDOW_MS) ||
  15 * 60 * 1000;

const rateLimitMax =
  Number(process.env.RATE_LIMIT_MAX) ||
  200;

app.use(
  rateLimit({
    windowMs: rateLimitWindow,
    max: rateLimitMax,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard.'
    }
  })
);

/*
|--------------------------------------------------------------------------
| Root endpoint
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'WorldArts API',
    version: '1.1.0',
    status: 'operational'
  });
});

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'worldarts-backend',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', authRoutes);

app.use('/api/payments', paymentsRoutes);

app.use('/api/artworks', artworksRoutes);

app.use('/api/artists', artistsRoutes);

app.use('/api/contact', contactRoutes);

/*
|--------------------------------------------------------------------------
| 404 handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global error handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Render PORT
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Render provides process.env.PORT automatically.
| Never hard-code the production port.
|
*/

const PORT = Number(process.env.PORT) || 4000;

const HOST = '0.0.0.0';

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(
      `WorldArts backend démarré sur ${HOST}:${PORT}`
    );

    console.log(
      `Environnement : ${
        process.env.NODE_ENV || 'development'
      }`
    );

    console.log(
      `Pi API : ${
        (
          process.env.PI_API_BASE_URL ||
          'https://api.minepi.com'
        ).replace(/\/$/, '')
      }`
    );

    const PORT = Number(process.env.PORT) || 10000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WorldArts backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Pi API: ${process.env.PI_API_BASE_URL || 'https://api.minepi.com'}`);
  });
}

module.exports = app;
