
// routes/payments.js
// Gestion des paiements Pi Network
// approve / complete / cancel / history

const express = require('express');
const { payments, uuidv4 } = require('../config/store');
const { piApi } = require('../config/piClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();



/**
 * POST /api/payments/approve
 * Kwemeza payment kuri Pi Server
 */
router.post('/approve', requireAuth, async (req,res)=>{

  try {

    const { paymentId } = req.body;


    if(!paymentId){

      return res.status(400).json({
        error:'paymentId irakenewe.'
      });

    }


    const response = await piApi.post(
      `/payments/${paymentId}/approve`
    );



    const payment = {

      id:uuidv4(),

      paymentId,

      uid:req.user.uid,

      status:'approved',

      createdAt:new Date().toISOString()

    };



    payments.set(paymentId,payment);



    res.json({

      success:true,

      payment:response.data

    });



  } catch(error){

    console.error(
      '[Approve Payment]',
      error.response?.data || error.message
    );


    res.status(500).json({

      error:'Ntivyashobotse kwemeza payment.'

    });

  }

});





/**
 * POST /api/payments/complete
 * Kurangiza payment ukoresheje txid
 */
router.post('/complete', requireAuth, async(req,res)=>{


  try {


    const {
      paymentId,
      txid
    } = req.body;



    if(!paymentId || !txid){

      return res.status(400).json({

        error:'paymentId na txid birakenewe.'

      });

    }



    const response = await piApi.post(

      `/payments/${paymentId}/complete`,

      {
        txid
      }

    );



    const payment = payments.get(paymentId);



    if(payment){

      payment.status='completed';

      payment.txid=txid;

      payments.set(paymentId,payment);

    }



    res.json({

      success:true,

      payment:response.data

    });



  } catch(error){


    console.error(
      '[Complete Payment]',
      error.response?.data || error.message
    );


    res.status(500).json({

      error:'Ntivyashobotse kurangiza payment.'

    });


  }


});





/**
 * POST /api/payments/cancel
 */
router.post('/cancel', requireAuth, async(req,res)=>{


  try {


    const { paymentId } = req.body;



    if(!paymentId){

      return res.status(400).json({

        error:'paymentId irakenewe.'

      });

    }



    const response = await piApi.post(

      `/payments/${paymentId}/cancel`

    );



    const payment = payments.get(paymentId);



    if(payment){

      payment.status='cancelled';

      payments.set(paymentId,payment);

    }



    res.json({

      success:true,

      payment:response.data

    });



  } catch(error){


    console.error(
      '[Cancel Payment]',
      error.response?.data || error.message
    );


    res.status(500).json({

      error:'Ntivyashobotse guhagarika payment.'

    });


  }


});





/**
 * GET /api/payments/history
 */
router.get('/history', requireAuth,(req,res)=>{


  const list = Array.from(payments.values())
    .filter(p => p.uid === req.user.uid);



  res.json({

    payments:list

  });


});





/**
 * GET /api/payments/incomplete
 */
router.get('/incomplete', requireAuth,(req,res)=>{


  const list = Array.from(payments.values())

    .filter(p =>

      p.uid === req.user.uid &&
      p.status !== 'completed'

    );



  res.json({

    payments:list

  });


});



module.exports = router;
