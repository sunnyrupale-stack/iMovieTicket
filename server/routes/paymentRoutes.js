const express = require('express');
const router = express.Router();
const { getMyPayments, getPaymentById } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my-payments', getMyPayments);
router.get('/:id', getPaymentById);

module.exports = router;
