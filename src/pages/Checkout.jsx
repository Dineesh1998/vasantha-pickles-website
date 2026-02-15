import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Banknote, ArrowLeft, CheckCircle, Plus, MapPin } from 'lucide-react';
import './Checkout.css';
import './Auth.css'; // Reusing auth styles

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const { user, login, loginWithGoogle, saveAddress, getAddresses, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Checkout Form State
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

    // Address Management State
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    // Login State within Checkout
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Load saved addresses when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const addresses = getAddresses();
            setSavedAddresses(addresses);
            // Pre-fill email from user profile
            setFormData(prev => ({ ...prev, email: user.email, firstName: user.name?.split(' ')[0] || '' }));
        }
    }, [isAuthenticated, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // If user modifies address manually, clear selected address selection
        if (['address', 'city', 'zipCode', 'phone'].includes(name)) {
            setSelectedAddressId(null);
        }
    };

    const handleAddressSelect = (addr) => {
        setSelectedAddressId(addr.id);
        setFormData(prev => ({
            ...prev,
            address: addr.address,
            city: addr.city,
            zipCode: addr.zipCode,
            phone: addr.phone || prev.phone,
            firstName: addr.firstName || prev.firstName,
            lastName: addr.lastName || prev.lastName
        }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoginError('');
        const success = login(loginEmail, loginPassword);
        if (!success) {
            setLoginError('Invalid email or password.');
        }
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

        if (!isAuthenticated) {
            showToast('Please login to place order', 'error');
            return;
        }

        setIsProcessing(true);

        // Save address if checked
        if (saveNewAddress && !selectedAddressId) {
            saveAddress({
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
                phone: formData.phone
            });
        }

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
                paymentMethod: paymentMethod,
                userId: user.email
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

    // Render Login View if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="checkout-page section">
                <div className="container">
                    <button className="back-link" onClick={() => navigate('/cart')}>
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                    <h1>Checkout Login</h1>

                    <div className="auth-section checkout-section">
                        <h2>Sign in to complete your order</h2>

                        {loginError && <div className="auth-error">{loginError}</div>}

                        <form onSubmit={handleLoginSubmit} className="auth-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary auth-btn">Login</button>
                        </form>

                        <div className="divider">OR</div>

                        <button className="google-btn" onClick={loginWithGoogle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated View
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

                            {/* Address Selection */}
                            {savedAddresses.length > 0 && (
                                <div className="checkout-section">
                                    <h2><MapPin size={20} /> Saved Addresses</h2>
                                    <div className="saved-addresses">
                                        {savedAddresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                                onClick={() => handleAddressSelect(addr)}
                                            >
                                                <p><strong>{addr.firstName} {addr.lastName}</strong></p>
                                                <p>{addr.address}</p>
                                                <p>{addr.city}, {addr.zipCode}</p>
                                                <p>{addr.phone}</p>
                                                {selectedAddressId === addr.id && <CheckCircle className="address-selected-icon" size={16} />}
                                            </div>
                                        ))}
                                        <div
                                            className={`address-card ${selectedAddressId === null ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAddressId(null);
                                                setFormData(prev => ({ ...prev, address: '', city: '', zipCode: '' }));
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}
                                        >
                                            <div className="add-address-card-content">
                                                <Plus size={24} className="add-address-icon" />
                                                <p>Add New Address</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Steps */}
                            <div className="checkout-section">
                                <h2><Truck size={20} /> Shipping Details</h2>
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" name="firstName" value={formData.firstName} required onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName} required onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={formData.email} required onChange={handleInputChange} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" name="address" value={formData.address} required onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" name="city" value={formData.city} required onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input type="text" name="zipCode" value={formData.zipCode} required onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} required onChange={handleInputChange} />
                                </div>

                                {!selectedAddressId && (
                                    <div className="save-address-checkbox">
                                        <input
                                            type="checkbox"
                                            id="saveAddress"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                        />
                                        <label htmlFor="saveAddress">Save this address for future orders</label>
                                    </div>
                                )}
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
