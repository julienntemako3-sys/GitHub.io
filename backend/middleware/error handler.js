// middleware/errorHandler.js

/**
 * Route itabonetse
 */
function notFound(req,res,next){

  res.status(404).json({

    error:`Route ntiboneka: ${req.method} ${req.originalUrl}`

  });

}



/**
 * Gestion globale y'amakosa
 */
function errorHandler(err,req,res,next){

  console.error('[ERROR]',err);


  const status = err.status || 500;


  res.status(status).json({

    error:
      err.message || 'Ikosa ritazwi ryabaye.'

  });

}



module.exports = {
  notFound,
  errorHandler
};
