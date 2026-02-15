import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = savedOrders.find(o => o.id === orderId);
        setOrder(foundOrder);
    }, [orderId]);

    if (!order) {
        return (
            <div className="section tracking-page">
                <div className="container center-msg">
                    <h2>Order Not Found</h2>
                    <Link to="/my-orders" className="btn btn-primary">Back to My Orders</Link>
                </div>
            </div>
        );
    }

    // Dynamic tracking steps logic based on real status
    const getStepStatus = (stepIndex, currentStatus) => {
        const statusLevels = ['Processing', 'Shipped', 'Delivered'];
        const currentLevel = statusLevels.indexOf(currentStatus);

        if (currentLevel === -1) return 'pending'; // Cancelled or unknown
        if (stepIndex < currentLevel) return 'completed';
        if (stepIndex === currentLevel) return 'current';
        return 'pending';
    };

    const steps = [
        {
            label: 'Order Placed',
            status: 'completed',
            date: new Date(order.date).toLocaleString(),
            icon: <Clock size={20} />
        },
        {
            label: 'Processing',
            status: getStepStatus(0, order.status),
            date: order.status === 'Processing' ? 'In Progress' : (order.status === 'Shipped' || order.status === 'Delivered' ? 'Completed' : 'Pending'),
            icon: <Package size={20} />
        },
        {
            label: 'Shipped',
            status: getStepStatus(1, order.status),
            date: order.status === 'Shipped' ? 'In Transit' : (order.status === 'Delivered' ? 'Shipped' : 'Pending'),
            icon: <Truck size={20} />
        },
        {
            label: 'Delivered',
            status: getStepStatus(2, order.status),
            date: order.status === 'Delivered' ? 'Delivered' : 'Pending',
            icon: <CheckCircle size={20} />
        }
    ];

    return (
        <div className="section tracking-page">
            <div className="container">
                <div className="tracking-header">
                    <h1>Track Order #{order.id}</h1>
                    <span className="current-status status-badge">{order.status}</span>
                </div>

                <div className="tracking-container">
                    <div className="tracking-timeline">
                        {steps.map((step, index) => (
                            <div key={index} className={`timeline-step ${step.status}`}>
                                <div className="step-icon-wrapper">
                                    {step.icon}
                                </div>
                                <div className="step-content">
                                    <h3>{step.label}</h3>
                                    <p>{step.date}</p>
                                    {step.label === 'Shipped' && order.trackingId && (
                                        <p className="tracking-id-display">DTDC ID: <strong>{order.trackingId}</strong></p>
                                    )}
                                </div>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>

                    <div className="order-details-sidebar">
                        <h3>Order Details</h3>
                        <p><strong>Shipping To:</strong><br />
                            {order.shippingDetails.firstName} {order.shippingDetails.lastName}<br />
                            {order.shippingDetails.address}, {order.shippingDetails.city}<br />
                            {order.shippingDetails.zipCode}</p>

                        <div className="item-list-mini">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="mini-item">
                                    <span>{item.name} ({item.size}) x{item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="mini-total">
                                <span>Total Paid</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
