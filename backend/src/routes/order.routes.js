import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
