// server.js
// WorldArts Backend - Node.js / Express

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
  notFound,
  errorHandler
} = require('./middleware/errorHandler');



const app = express();



/**
 * Middlewares
 */

// CORS
const allowedOrigins = (
  process.env.FRONTEND_URLS || ''
)
.split(',')
.map(url => url.trim())
.filter(Boolean);



app.use(cors({

  origin: allowedOrigins.length
    ? allowedOrigins
    : '*',

  methods:[
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders:[
    'Content-Type',
    'Authorization'
  ]

}));



// JSON parser
app.use(express.json());





/**
 * Health check
 */
app.get('/health',(req,res)=>{

  res.json({

    status:'ok',

    service:'WorldArts Backend',

    time:new Date().toISOString()

  });

});





/**
 * Routes
 */

app.use(
  '/api/auth',
  require('./routes/auth')
);


app.use(
  '/api/payments',
  require('./routes/payments')
);


app.use(
  '/api/artworks',
  require('./routes/artworks')
);


app.use(
  '/api/artists',
  require('./routes/artists')
);





/**
 * Error handlers
 * (bikorwa nyuma ya routes)
 */

app.use(notFound);

app.use(errorHandler);





/**
 * Server start
 */

const PORT =
  process.env.PORT || 4000;



app.listen(PORT,()=>{

  console.log(
    `WorldArts Backend running on port ${PORT}`
  );

});
