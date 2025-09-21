const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key_here'
});

class PaymentController {
  // Create Razorpay order
  static async createOrder(req, res) {
    try {
      const { amount, currency, receipt, notes } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount'
        });
      }

      const options = {
        amount: amount, // Amount in paise
        currency: currency || 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {}
      };

      const order = await razorpay.orders.create(options);
      
      res.json({
        success: true,
        data: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          created_at: order.created_at
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verify Razorpay payment
  static async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentData } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment verification data'
        });
      }

      // Create signature for verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_key_here')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed - Invalid signature'
        });
      }

      // Here you would typically save the payment record to your database
      // For now, we'll just log it
      console.log('Payment verified successfully:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: paymentData?.paidAmount,
        vendor: paymentData?.vendorName,
        billNo: paymentData?.vendorBillNo
      });

      // TODO: Save payment record to database
      // const paymentRecord = {
      //   organizationId: req.user.organizationId,
      //   orderId: razorpay_order_id,
      //   paymentId: razorpay_payment_id,
      //   amount: paymentData.paidAmount,
      //   currency: 'INR',
      //   status: 'completed',
      //   paymentMethod: paymentData.paymentMethod,
      //   vendorName: paymentData.vendorName,
      //   vendorBillNo: paymentData.vendorBillNo,
      //   processedAt: new Date(),
      //   // ... other fields
      // };

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: paymentData?.paidAmount,
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Verify payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get payment status
  static async getPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;
      
      const payment = await razorpay.payments.fetch(paymentId);
      
      res.json({
        success: true,
        data: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          created_at: payment.created_at
        }
      });
    } catch (error) {
      console.error('Get payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get payment status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Refund payment
  static async refundPayment(req, res) {
    try {
      const { paymentId, amount, notes } = req.body;
      
      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment ID is required'
        });
      }

      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount, // Amount in paise (optional - full refund if not provided)
        notes: notes || {}
      });
      
      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          id: refund.id,
          amount: refund.amount,
          status: refund.status,
          created_at: refund.created_at
        }
      });
    } catch (error) {
      console.error('Refund payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = PaymentController;
