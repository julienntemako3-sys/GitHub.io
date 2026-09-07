function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route introuvable.',
    path: req.originalUrl
  });
}

function errorHandler(err, req, res, next) {
  console.error('WorldArts server error:', err.message || err);

  if (res.headersSent) return next(err);

  const status = Number(err.status) || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Erreur interne du serveur.' : (err.message || 'Erreur serveur.')
  });
}

module.exports = { notFound, errorHandler };
