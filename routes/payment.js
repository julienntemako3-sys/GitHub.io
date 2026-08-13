// routes/payments.js
// WorldArts - Pi Network Payments

const express = require('express');

const {
  payments,
  uuidv4
} = require('../config/store');

const {
  piApi
} = require('../config/piClient');

const {
  requireAuth
} = require('../middleware/auth');

const router = express.Router();


/**
 * POST /api/payments/create
 * Create a Pi payment
 */
router.post(
  '/create',
  requireAuth,
  async (req, res) => {

    try {

      const {
        amount,
        memo,
        metadata
      } = req.body;


      if (
        amount === undefined ||
        Number(amount) <= 0
      ) {

        return res.status(400).json({
          success: false,
          error: 'Amount ya Pi irakenewe kandi igomba kuba irenga 0.'
        });

      }


      const payment = {

        id: uuidv4(),

        uid: req.user.uid,

        userId: req.user.id,

        amount: Number(amount),

        memo: memo || 'WorldArts payment',

        metadata: metadata || {},

        status: 'created',

        createdAt: new Date().toISOString()

      };


      payments.set(
        payment.id,
        payment
      );


      res.status(201).json({

        success: true,

        payment

      });


    } catch (error) {

      console.error(
        '[Create Payment]',
        error.response?.data || error.message
      );


      res.status(500).json({

        success: false,

        error: 'Ntivyashobotse gukora payment.'

      });

    }

  }
);


/**
 * POST /api/payments/approve
 * Approve Pi payment
 */
router.post(
  '/approve',
  requireAuth,
  async (req, res) => {

    try {

      const {
        paymentId
      } = req.body;


      if (!paymentId) {

        return res.status(400).json({

          success: false,

          error: 'paymentId irakenewe.'

        });

      }


      const payment = payments.get(
        paymentId
      );


      if (!payment) {

        return res.status(404).json({

          success: false,

          error: 'Payment ntibonetse.'

        });

      }


      if (
        payment.uid !== req.user.uid
      ) {

        return res.status(403).json({

          success: false,

          error: 'Iyi payment si iyawe.'

        });

      }


      payment.status = 'approved';

      payment.updatedAt =
        new Date().toISOString();


      payments.set(
        paymentId,
        payment
      );


      res.json({

        success: true,

        payment

      });


    } catch (error) {

      console.error(
        '[Approve Payment]',
        error.message
      );


      res.status(500).json({

        success: false,

        error: 'Ntivyashobotse kwemeza payment.'

      });

    }

  }
);


/**
 * POST /api/payments/complete
 * Complete Pi payment
 */
router.post(
  '/complete',
  requireAuth,
  async (req, res) => {

    try {

      const {
        paymentId
      } = req.body;


      if (!paymentId) {

        return res.status(400).json({

          success: false,

          error: 'paymentId irakenewe.'

        });

      }


      const payment = payments.get(
        paymentId
      );


      if (!payment) {

        return res.status(404).json({

          success: false,

          error: 'Payment ntibonetse.'

        });

      }


      if (
        payment.uid !== req.user.uid
      ) {

        return res.status(403).json({

          success: false,

          error: 'Iyi payment si iyawe.'

        });

      }


      payment.status = 'completed';

      payment.completedAt =
        new Date().toISOString();


      payments.set(
        paymentId,
        payment
      );


      res.json({

        success: true,

        payment

      });


    } catch (error) {

      console.error(
        '[Complete Payment]',
        error.message
      );


      res.status(500).json({

        success: false,

        error: 'Ntivyashobotse guheza payment.'

      });

    }

  }
);


/**
 * POST /api/payments/cancel
 * Cancel Pi payment
 */
router.post(
  '/cancel',
  requireAuth,
  async (req, res) => {

    try {

      const {
        paymentId
      } = req.body;


      if (!paymentId) {

        return res.status(400).json({

          success: false,

          error: 'paymentId irakenewe.'

        });

      }


      const payment = payments.get(
        paymentId
      );


      if (!payment) {

        return res.status(404).json({

          success: false,

          error: 'Payment ntibonetse.'

        });

      }


      if (
        payment.uid !== req.user.uid
      ) {

        return res.status(403).json({

          success: false,

          error: 'Iyi payment si iyawe.'

        });

      }


      payment.status = 'cancelled';

      payment.updatedAt =
        new Date().toISOString();


      payments.set(
        paymentId,
        payment
      );


      res.json({

        success: true,

        payment

      });


    } catch (error) {

      console.error(
        '[Cancel Payment]',
        error.message
      );


      res.status(500).json({

        success: false,

        error: 'Ntivyashobotse guhagarika payment.'

      });

    }

  }
);


/**
 * GET /api/payments/history
 * Payment history for current user
 */
router.get(
  '/history',
  requireAuth,
  (req, res) => {

    const list =
      Array.from(payments.values())
        .filter(
          payment =>
            payment.uid === req.user.uid
        );


    res.json({

      success: true,

      count: list.length,

      payments: list

    });

  }
);


/**
 * GET /api/payments/incomplete
 * Incomplete payments for current user
 */
router.get(
  '/incomplete',
  requireAuth,
  (req, res) => {

    const list =
      Array.from(payments.values())
        .filter(
          payment =>
            payment.uid === req.user.uid &&
            payment.status !== 'completed'
        );


    res.json({

      success: true,

      count: list.length,

      payments: list

    });

  }
);


module.exports = router;
