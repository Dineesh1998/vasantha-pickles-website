import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(storedOrders);
    }, []);

    const updateOrderStatus = (orderId, newStatus) => {
        let trackingId = null;

        if (newStatus === 'Shipped') {
            const input = window.prompt("Please enter the DTDC Tracking ID:");
            if (input === null) return; // Cancelled
            trackingId = input;
        }

        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: newStatus,
                    // Update trackingId only if we have a new one, otherwise keep existing
                    trackingId: trackingId || order.trackingId
                };
            }
            return order;
        });

        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchSearch = order.id.includes(searchTerm) ||
            order.shippingDetails?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingDetails?.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    const stats = {
        total: orders.length,
        processing: orders.filter(o => o.status === 'Processing').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length
    };

    return (
        <div className="section admin-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Seller Dashboard</h1>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search Order ID, Name..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon bg-blue-50 text-blue-600">
                            <Package size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p>{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-yellow-50 text-yellow-600">
                            <Clock size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>Processing</h3>
                            <p>{stats.processing}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-indigo-50 text-indigo-600">
                            <Truck size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>Shipped</h3>
                            <p>{stats.shipped}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-green-50 text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>Delivered</h3>
                            <p>{stats.delivered}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="order-id">#{order.id}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="customer-info">
                                            <p className="font-medium">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                                            <p className="text-sm text-gray-500">{order.shippingDetails?.email}</p>
                                            <div className="text-xs text-gray-600 mt-1">
                                                <p>{order.shippingDetails?.address}</p>
                                                <p>{order.shippingDetails?.city} - {order.shippingDetails?.zipCode}</p>
                                                <p>Ph: {order.shippingDetails?.phone}</p>
                                            </div>
                                        </td>
                                        <td className="order-items-summary">
                                            {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                                        </td>
                                        <td className="font-bold">₹{order.total}</td>
                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select-action text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                value={order.status}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    updateOrderStatus(order.id, newStatus);
                                                }}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colspan="7" className="text-center py-8 text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
