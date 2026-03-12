import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) { setLoading(false); return; }
            try {
                const { data } = await orderAPI.getMyOrders();
                setOrders(data.orders);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="section my-orders-page">
                <div className="container empty-orders">
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="section my-orders-page">
                <div className="container empty-orders">
                    <Package size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
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
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-preview-items">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <span key={idx}>{item.name} (x{item.quantity}){idx < Math.min(order.items.length, 3) - 1 ? ', ' : ''}</span>
                                ))}
                                {order.items.length > 3 && <span> ... +{order.items.length - 3} more</span>}
                            </div>

                            <div className="order-footer">
                                <span className="order-total">Total: ₹{order.total}</span>
                                <Link to={`/tracking/${order._id}`} className="btn btn-outline btn-sm">
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
