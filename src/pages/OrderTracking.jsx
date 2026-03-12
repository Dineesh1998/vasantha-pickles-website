import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import './OrderTracking.css';

/* ── Status level mapping ─────────────────────────────────────── */
const STATUS_LEVELS = {
    Processing: 1,
    Confirmed: 2,
    Shipped: 3,
    Delivered: 4,
    Cancelled: -1
};

const STEPS = [
    { label: 'Order Placed', icon: Clock, desc: 'Your order has been received.' },
    { label: 'Confirmed', icon: CheckCircle, desc: 'Seller confirmed your order.' },
    { label: 'Shipped', icon: Truck, desc: 'Your order is on the way.' },
    { label: 'Delivered', icon: Package, desc: 'Your order has been delivered.' }
];

const getStepState = (stepIndex, currentStatus) => {
    if (currentStatus === 'Cancelled') return stepIndex === 0 ? 'completed' : 'cancelled';
    const level = STATUS_LEVELS[currentStatus] ?? 1;
    if (stepIndex + 1 < level) return 'completed';
    if (stepIndex + 1 === level) return 'current';
    return 'pending';
};

/* ── Status badge colour ──────────────────────────────────────── */
const STATUS_STYLES = {
    Processing: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    Confirmed: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    Shipped: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
    Delivered: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
    Cancelled: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
};

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await orderAPI.getById(orderId);
            setOrder(data.order);
        } catch (err) {
            setError(err.response?.data?.message || 'Order not found or you are not authorized.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    /* ── Loading ─────────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="section tracking-page">
                <div className="container tracking-loading">
                    <RefreshCw size={40} className="spin-icon" />
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    /* ── Error / Not Found ───────────────────────────────────── */
    if (error || !order) {
        return (
            <div className="section tracking-page">
                <div className="container">
                    <div className="tracking-not-found">
                        <XCircle size={56} className="not-found-icon" />
                        <h2>Order Not Found</h2>
                        <p>{error || 'We could not find this order.'}</p>
                        <Link to="/my-orders" className="btn btn-primary">
                            <ArrowLeft size={16} /> Back to My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Processing;
    const isCancelled = order.status === 'Cancelled';

    return (
        <div className="section tracking-page">
            <div className="container">

                {/* Back */}
                <Link to="/my-orders" className="tracking-back-link">
                    <ArrowLeft size={16} /> Back to My Orders
                </Link>

                {/* Header */}
                <div className="tracking-header">
                    <div>
                        <h1>Track Order</h1>
                        <span className="tracking-order-id">
                            #{order._id.slice(-10).toUpperCase()}
                        </span>
                    </div>
                    <span
                        className="tracking-status-badge"
                        style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}
                    >
                        {order.status}
                    </span>
                </div>

                <div className="tracking-container">

                    {/* ── Timeline ──────────────────────────────────────── */}
                    <div className="tracking-timeline-card">
                        <h2 className="timeline-title">Delivery Progress</h2>

                        {isCancelled && (
                            <div className="cancelled-banner">
                                <XCircle size={18} />
                                This order was cancelled.
                            </div>
                        )}

                        <div className="tracking-timeline">
                            {STEPS.map((step, index) => {
                                const state = getStepState(index, order.status);
                                const Icon = step.icon;
                                return (
                                    <div key={step.label} className={`timeline-step tl-${state}`}>
                                        <div className="step-left">
                                            <div className="step-icon-wrapper">
                                                <Icon size={20} />
                                            </div>
                                            {index < STEPS.length - 1 && (
                                                <div className={`step-line ${state === 'completed' ? 'line-done' : ''}`} />
                                            )}
                                        </div>
                                        <div className="step-content">
                                            <h3>{step.label}</h3>
                                            <p className="step-desc">{step.desc}</p>
                                            {/* Show tracking ID on Shipped step */}
                                            {step.label === 'Shipped' && order.trackingId && (
                                                <span className="tracking-id-pill">
                                                    🚚 DTDC: <strong>{order.trackingId}</strong>
                                                </span>
                                            )}
                                            {/* Show order placed date on first step */}
                                            {step.label === 'Order Placed' && (
                                                <span className="step-date">
                                                    {new Date(order.createdAt).toLocaleString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                            <span className={`step-state-label step-state-${state}`}>
                                                {state === 'completed' ? '✓ Done'
                                                    : state === 'current' ? '● In Progress'
                                                        : state === 'cancelled' ? '✕ Cancelled'
                                                            : '○ Pending'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Sidebar ───────────────────────────────────────── */}
                    <div className="tracking-sidebar">

                        {/* Shipping Address */}
                        <div className="tracking-info-card">
                            <h3><MapPin size={16} /> Shipping Address</h3>
                            <div className="shipping-address">
                                <p className="addr-name">
                                    {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                                </p>
                                <p>{order.shippingDetails.address}</p>
                                <p>{order.shippingDetails.city} — {order.shippingDetails.zipCode}</p>
                                <p>📞 {order.shippingDetails.phone}</p>
                                <p>✉️ {order.shippingDetails.email}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="tracking-info-card">
                            <h3><Package size={16} /> Order Items</h3>
                            <div className="item-list-mini">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="mini-item">
                                        <div className="mini-item-info">
                                            <span className="mini-item-name">{item.name}</span>
                                            <span className="mini-item-meta">{item.size} × {item.quantity}</span>
                                        </div>
                                        <span className="mini-item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mini-summary">
                                <div className="mini-row">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                </div>
                                <div className="mini-row">
                                    <span>Shipping</span>
                                    <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                                </div>
                                <div className="mini-total">
                                    <span>Total Paid</span>
                                    <span>₹{order.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="tracking-info-card">
                            <h3>💳 Payment</h3>
                            <div className="payment-info-row">
                                <span>Method</span>
                                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery'
                                        : order.paymentMethod === 'razorpay' ? 'Razorpay'
                                            : 'UPI'}
                                </span>
                            </div>
                            <div className="payment-info-row">
                                <span>Status</span>
                                <span className={`pay-status pay-${order.paymentStatus}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
