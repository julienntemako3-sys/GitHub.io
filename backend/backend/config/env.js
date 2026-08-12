require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PI_API_URL: process.env.PI_API_URL || 'https://api.minepi.com/v2',
  PI_API_KEY: process.env.PI_API_KEY,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 200,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
