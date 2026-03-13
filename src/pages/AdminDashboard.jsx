import React, { useState, useEffect, useCallback } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, RefreshCw, IndianRupee } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import './AdminDashboard.css';

const STATUS_COLORS = {
    Processing: 'status-processing',
    Confirmed: 'status-confirmed',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled'
};

const AdminDashboard = () => {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // ─── Fetch all orders from backend ────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await orderAPI.getAll();
            setOrders(data.orders);
        } catch (error) {
            showToast('Failed to load orders. Make sure you are logged in as Admin.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ─── Update order status via backend ──────────────────────────────────────
    const updateOrderStatus = async (orderId, newStatus) => {
        if (newStatus === 'Shipped') {
            const trackingId = window.prompt('Enter the DTDC Tracking ID:');
            if (trackingId === null) return; // user cancelled
        }

        setUpdatingId(orderId);
        try {
            const { data } = await orderAPI.updateStatus(orderId, newStatus);
            // Update local state immediately so UI reflects change instantly
            setOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, status: data.order.status } : o)
            );
            showToast(`Order status updated to "${newStatus}"`, 'success');
        } catch (error) {
            showToast('Failed to update order status.', 'error');
            console.error(error);
        } finally {
            setUpdatingId(null);
        }
    };

    // ─── Filter & Search ──────────────────────────────────────────────────────
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'All' || order.status === filterStatus;
        const term = searchTerm.toLowerCase();
        const matchSearch =
            order.id.toLowerCase().includes(term) ||
            order.shippingDetails?.firstName?.toLowerCase().includes(term) ||
            order.shippingDetails?.lastName?.toLowerCase().includes(term) ||
            order.shippingDetails?.email?.toLowerCase().includes(term) ||
            order.shippingDetails?.phone?.includes(term);
        return matchStatus && matchSearch;
    });

    // ─── Stats ────────────────────────────────────────────────────────────────
    const stats = {
        total: orders.length,
        processing: orders.filter(o => o.status === 'Processing').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        revenue: orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
    };

    return (
        <div className="section admin-dashboard">
            <div className="container">

                {/* Header */}
                <div className="dashboard-header">
                    <h1>Seller Dashboard</h1>
                    <div className="dashboard-header-right">
                        <div className="search-box">
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Name, Phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="btn btn-outline refresh-btn" onClick={fetchOrders} title="Refresh orders">
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--blue"><Package size={24} /></div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p>{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--yellow"><Clock size={24} /></div>
                        <div className="stat-info">
                            <h3>Processing</h3>
                            <p>{stats.processing}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--indigo"><Truck size={24} /></div>
                        <div className="stat-info">
                            <h3>Shipped</h3>
                            <p>{stats.shipped}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--green"><CheckCircle size={24} /></div>
                        <div className="stat-info">
                            <h3>Delivered</h3>
                            <p>{stats.delivered}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--emerald"><IndianRupee size={24} /></div>
                        <div className="stat-info">
                            <h3>Total Revenue</h3>
                            <p>₹{stats.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="orders-table-container">
                    {loading ? (
                        <div className="table-loading">
                            <RefreshCw size={32} className="spin" />
                            <p>Loading orders from database...</p>
                        </div>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Payment</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="order-id">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                            <td>
                                                {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                <br />
                                                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="customer-info">
                                                <p className="font-medium">
                                                    {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{order.shippingDetails?.email}</p>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    <p>{order.shippingDetails?.address}</p>
                                                    <p>{order.shippingDetails?.city} - {order.shippingDetails?.zipCode}</p>
                                                    <p>📞 {order.shippingDetails?.phone}</p>
                                                </div>
                                            </td>
                                            <td className="order-items-summary">
                                                {order.items.map((i, idx) => (
                                                    <span key={idx} style={{ display: 'block', fontSize: '0.8rem' }}>
                                                        • {i.name} × {i.quantity} ({i.size})
                                                    </span>
                                                ))}
                                            </td>
                                            <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
                                                {order.paymentMethod === 'cod' ? '💵 COD' :
                                                    order.paymentMethod === 'razorpay' ? '💳 Razorpay' : '📱 UPI'}
                                                <br />
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: order.paymentStatus === 'paid' ? 'green' : 'orange'
                                                }}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="font-bold">₹{order.total}</td>
                                            <td>
                                                <span className={`order-status-badge ${STATUS_COLORS[order.status] || ''}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="status-select-action"
                                                    value={order.status}
                                                    disabled={updatingId === order.id}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                {updatingId === order.id && (
                                                    <span style={{ fontSize: '0.7rem', color: '#888' }}> Saving...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-gray-500">
                                            {searchTerm || filterStatus !== 'All'
                                                ? 'No orders match your search/filter.'
                                                : 'No orders yet. Orders from customers will appear here.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
