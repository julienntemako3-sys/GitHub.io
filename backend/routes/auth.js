
// routes/auth.js
// Pi Network authentication + WorldArts JWT

const express = require('express');
const jwt = require('jsonwebtoken');
const { piApi } = require('../config/piClient');
const { users, uuidv4 } = require('../config/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();



/**
 * POST /api/auth/pi-login
 * Kwemeza Pi accessToken no gukora JWT ya WorldArts
 */
router.post('/pi-login', async (req,res)=>{

  try {

    const { accessToken } = req.body;


    if(!accessToken){

      return res.status(400).json({
        error:'Pi accessToken irakenewe.'
      });

    }


    const response = await piApi.get('/me',{

      headers:{
        Authorization:`Bearer ${accessToken}`
      }

    });


    const piUser = response.data;



    let user = Array.from(users.values())
      .find(u => u.uid === piUser.uid);



    if(!user){

      const id = uuidv4();


      user = {

        id,

        uid:piUser.uid,

        username:piUser.username || '',

        roles:['user'],

        createdAt:new Date().toISOString()

      };


      users.set(id,user);

    }



    const token = jwt.sign(

      {
        id:user.id,
        uid:user.uid,
        username:user.username,
        roles:user.roles
      },

      process.env.JWT_SECRET,

      {
        expiresIn:'7d'
      }

    );



    res.json({

      token,

      user

    });



  } catch(error){

    console.error(
      '[Pi Login]',
      error.response?.data || error.message
    );


    res.status(401).json({

      error:'Pi authentication yanse.'

    });

  }

});





/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth,(req,res)=>{


  const user = users.get(req.user.id);



  if(!user){

    return res.status(404).json({

      error:'User ntabonetse.'

    });

  }



  res.json({

    user

  });


});



module.exports = router;
