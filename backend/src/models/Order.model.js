import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const shippingDetailsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    zipCode: String,
    phone: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingDetails: shippingDetailsSchema,
    paymentMethod: { type: String, enum: ['card', 'upi', 'cod', 'razorpay'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
