import { createRequire } from 'module';
import crypto from 'crypto';
import Order from '../models/Order.model.js';

const require = createRequire(import.meta.url);
const Razorpay = require('razorpay');

// Razorpay instance created lazily — avoids crash at startup if keys aren't set yet
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
        throw new Error('Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// @desc   Create a Razorpay order
// @route  POST /api/payments/create-order
// @access Private
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const razorpay = getRazorpayInstance();

        const options = {
            amount: amount * 100, // Razorpay uses paise
            currency: 'INR',
            receipt: `receipt_${crypto.randomUUID()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);
        res.json({ success: true, order: razorpayOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Verify payment signature after payment
// @route  POST /api/payments/verify
// @access Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        // Create expected signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }

        // Update order in DB as paid
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status: 'Confirmed'
        });

        res.json({ success: true, message: 'Payment verified successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
