import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount, cartTotal } = useCart();
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
            <div className="container navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-main">VASANTHA</span>
                    <span className="logo-sub">Home Made Pickles</span>
                </Link>

                {/* Links Section - Center Aligned */}
                <div className={`navbar-links desktop-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsOpen(false)}>HOME</Link>
                    <Link to="/products" onClick={() => setIsOpen(false)}>SHOP ALL</Link>
                    <Link to="/products?category=Veg Pickles" onClick={() => setIsOpen(false)}>VEG PICKLES</Link>
                    <Link to="/products?category=Non Veg Pickles" onClick={() => setIsOpen(false)}>NON-VEG PICKLE'S</Link>
                    <Link to="/products?category=Sweets" onClick={() => setIsOpen(false)}>SWEET'S</Link>
                    <Link to="/products?category=Hots" onClick={() => setIsOpen(false)}>HOT'S</Link>
                    <Link to="/products?category=Spices" onClick={() => setIsOpen(false)}>SPICE'S</Link>
                    <Link to="/products?category=Powders" onClick={() => setIsOpen(false)}>POWDER'S</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)}>ABOUT US</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} style={{ color: '#FCD34D' }}>SELLER ADMIN</Link>
                    )}
                </div>

                {/* Actions Section - Right Aligned */}
                <div className="navbar-actions">
                    {/* Search */}
                    <div className={`search-container ${showSearch ? 'active' : ''}`}>
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="SEARCH..."
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
                                <Search size={22} strokeWidth={2} />
                            </button>
                        </form>
                    </div>

                    {/* Profile */}
                    {user ? (
                        <div className="profile-menu-container">
                            <button
                                className="icon-btn"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <User size={22} strokeWidth={2} />
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
                        <Link to="/login" className="icon-btn">
                            <User size={22} strokeWidth={2} />
                        </Link>
                    )}

                    {/* Wishlist (Heart) - Placeholder */}
                    <Link to="/wishlist" className="icon-btn">
                        {/* Using Heart icon from lucide-react (need to import if not present, but standard usually available or I check imports) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-heart"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </Link>

                    {/* Cart Section - Boxed */}
                    <Link to="/cart" className="cart-container-boxed">
                        <ShoppingBag size={20} strokeWidth={2} />
                        <span className="cart-count-superscript">{cartCount}</span>
                        <span className="cart-price">₹{cartTotal.toFixed(2)}</span>
                    </Link>

                    {/* Track Button */}
                    <Link to="/my-orders" className="btn-track">
                        TRACK
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="icon-btn mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
