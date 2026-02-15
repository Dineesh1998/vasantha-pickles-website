import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="wishlist-page section">
            <div className="container">
                <div className="wishlist-header">
                    <h1>My Wishlist <Heart size={28} fill="#ef4444" color="#ef4444" className="inline-block ml-2" /></h1>
                    <p>{wishlist.length} items</p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="products-grid grid grid-cols-4">
                        {wishlist.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-wishlist">
                        <Heart size={64} className="text-gray-300 mb-4" />
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love here for later.</p>
                        <Link to="/products" className="btn btn-primary mt-4">Start Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
