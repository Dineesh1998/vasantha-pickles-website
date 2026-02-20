import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
    }, []);

    if (orders.length === 0) {
        return (
            <div className="section my-orders-page">
                <div className="container empty-orders">
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders with us yet.</p>
                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section my-orders-page">
            <div className="container">
                <h1>My Orders</h1>
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">
                                        {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-preview-items">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <span key={item.uniqueId || item.id}>{item.name} (x{item.quantity}){idx < order.items.length - 1 ? ', ' : ''}</span>
                                ))}
                                {order.items.length > 3 && <span>... +{order.items.length - 3} more</span>}
                            </div>

                            <div className="order-footer">
                                <span className="order-total">Total: ₹{order.total}</span>
                                <Link to={`/tracking/${order.id}`} className="btn btn-outline btn-sm">
                                    Track Order <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
