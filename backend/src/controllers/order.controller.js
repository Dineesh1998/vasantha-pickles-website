import Order from '../models/Order.model.js';

// @desc   Place a new order
// @route  POST /api/orders
// @access Private
export const placeOrder = async (req, res) => {
    try {
        const { items, shippingDetails, paymentMethod, subtotal, shipping, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order.' });
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            shippingDetails,
            paymentMethod,
            subtotal,
            shipping,
            total,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get all orders for the logged-in user
// @route  GET /api/orders/my
// @access Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get a single order detail
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

        // Ensure user can only access their own orders (unless admin)
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get all orders (Admin)
// @route  GET /api/orders
// @access Admin Only
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Update order status (Admin)
// @route  PUT /api/orders/:id/status
// @access Admin Only
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
