import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        const shipping = cartTotal > 500 ? 0 : 50;
        return {
            subtotal: cartTotal,
            shipping,
            total: cartTotal + shipping
        };
    };

    const { subtotal, shipping, total } = calculateTotal();

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API call / Payment Gateway processing
        setTimeout(() => {
            const newOrder = {
                id: Math.floor(Math.random() * 1000000).toString(),
                date: new Date().toISOString(),
                items: cart,
                total: total,
                shipping: shipping,
                status: 'Processing', // Default status
                shippingDetails: formData,
                paymentMethod: paymentMethod
            };

            // Save to local storage (simulating backend)
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

            setIsProcessing(false);
            setOrderPlaced(true);
            clearCart();
            showToast('Order placed successfully!', 'success');

            // Redirect to orders page after 3 seconds
            setTimeout(() => {
                navigate('/my-orders');
            }, 3000);
        }, 2000);
    };

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="checkout-page section">
                <div className="container empty-cart-msg">
                    <p>Your cart is empty. Please add items to checkout.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="checkout-page section">
                <div className="container success-container">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your purchase, {formData.firstName}.</p>
                    <p className="order-id">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                    <p className="redirect-msg">Redirecting to home in a few seconds...</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page section">
            <div className="container">
                <button className="back-link" onClick={() => navigate('/cart')}>
                    <ArrowLeft size={16} /> Back to Cart
                </button>
                <h1>Checkout</h1>

                <div className="checkout-layout">
                    {/* Left Column: Forms */}
                    <div className="checkout-forms">
                        <form id="checkout-form" onSubmit={handlePlaceOrder}>
                            {/* Shipping Steps */}
                            <div className="checkout-section">
                                <h2><Truck size={20} /> Shipping Details</h2>
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" name="firstName" required onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="lastName" required onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" required onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" name="address" required onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" name="city" required onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input type="text" name="zipCode" required onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" required onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="checkout-section">
                                <h2><CreditCard size={20} /> Payment Method</h2>
                                <div className="payment-options">
                                    <div
                                        className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <input type="radio" checked={paymentMethod === 'card'} readOnly />
                                        <span>Credit/Debit Card</span>
                                        <CreditCard size={20} className="payment-icon" />
                                    </div>

                                    <div
                                        className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('upi')}
                                    >
                                        <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                                        <span>UPI (GPay/PhonePe)</span>
                                        <Banknote size={20} className="payment-icon" />
                                    </div>

                                    <div
                                        className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                                        <span>Cash on Delivery</span>
                                        <Truck size={20} className="payment-icon" />
                                    </div>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="card-details fade-in">
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input type="text" placeholder="123" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="upi-details fade-in">
                                        <div className="form-group">
                                            <label>UPI ID</label>
                                            <input type="text" placeholder="username@bank" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item.uniqueId} className="summary-item">
                                        <div className="summary-item-info">
                                            <span>{item.name}</span>
                                            <span className="summary-item-variant">x{item.quantity} ({item.size})</span>
                                        </div>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form" // Binds to the form ID above
                                className="btn btn-primary place-order-btn"
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : `Pay ₹${total}`}
                            </button>

                            <p className="secure-badge">
                                <CheckCircle size={14} /> Secure Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
