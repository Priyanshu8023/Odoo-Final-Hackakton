const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { authenticate, adminOrInvoicingUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Create Razorpay order
router.post('/create-order', adminOrInvoicingUser, PaymentController.createOrder);

// Verify Razorpay payment
router.post('/verify-payment', adminOrInvoicingUser, PaymentController.verifyPayment);

// Get payment status
router.get('/status/:paymentId', adminOrInvoicingUser, PaymentController.getPaymentStatus);

// Refund payment
router.post('/refund', adminOrInvoicingUser, PaymentController.refundPayment);

module.exports = router;
