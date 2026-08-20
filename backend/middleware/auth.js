// middleware/auth.js
// JWT authentication middleware for WorldArts

const jwt = require('jsonwebtoken');
const { users } = require('../config/store');


function requireAuth(req, res, next) {

  const header = req.headers.authorization;


  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token JWT irakenewe.'
    });
  }


  const token = header.split(' ')[1];


  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    req.user = decoded;


    next();


  } catch (error) {

    return res.status(401).json({
      error:'Token JWT ntikiri valid.'
    });

  }

}



function optionalAuth(req,res,next){

  const header = req.headers.authorization;


  if(!header || !header.startsWith('Bearer ')){
    return next();
  }


  const token = header.split(' ')[1];


  try {

    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

  } catch(error){

    req.user = null;

  }


  next();

}



module.exports = {
  requireAuth,
  optionalAuth
};
