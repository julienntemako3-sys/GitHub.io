const express = require('express');
const cors = require('cors');

const paymentsRouter = require('./routes/payments');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, service: 'WorldArts backend', status: 'running' });
});

app.use('/api/payments', paymentsRouter);

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
