import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-banner">
                Free Shipping Above ₹999 for AP & TS! 🚚
            </div>
            <div className="container navbar-container">
                <div className="navbar-logo">
                    <Link to="/">
                        <h1>Vasantha Home Made Pickles</h1>
                    </Link>
                </div>

                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsOpen(false)}>Shop All</Link>
                    <Link to="/products?category=Veg Pickles" onClick={() => setIsOpen(false)}>Pickles</Link>
                    <Link to="/products?category=Sweets" onClick={() => setIsOpen(false)}>Sweets</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                </div>

                <div className="navbar-actions">
                    <div className={`search-container ${showSearch ? 'active' : ''}`}>
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={showSearch ? 'show' : ''}
                            />
                            <button type="button" className="icon-btn search-toggle" onClick={() => {
                                if (showSearch && searchQuery.trim()) {
                                    handleSearch({ preventDefault: () => { } });
                                } else {
                                    setShowSearch(!showSearch);
                                }
                            }}>
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    <Link to="/cart" className="icon-btn">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div className="profile-menu-container">
                            <button
                                className="icon-btn"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <User size={20} />
                            </button>
                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <p className="profile-name">{user.name}</p>
                                        <p className="profile-email">{user.email}</p>
                                    </div>
                                    <Link to="/my-orders" className="profile-item" onClick={() => setShowProfileMenu(false)}>
                                        <Package size={16} /> My Orders
                                    </Link>
                                    <button onClick={logout} className="profile-item">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm hidden-mobile">
                            Login
                        </Link>
                    )}

                    <button className="icon-btn mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
