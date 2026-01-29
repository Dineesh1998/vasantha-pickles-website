import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-page section">
                <div className="container empty-cart">
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any pickles yet.</p>
                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page section">
            <div className="container">
                <h1>Shopping Cart</h1>
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.uniqueId} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-variant">Size: {item.size}</p>
                                    <p className="cart-item-price">₹{item.price}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}><Minus size={16} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}><Plus size={16} /></button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.uniqueId)}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary checkout-btn">
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
