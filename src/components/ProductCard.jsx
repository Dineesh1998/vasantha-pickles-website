import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { QUANTITY_OPTIONS } from '../data/products';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    // Determine which options to use: product-specific variants OR global default options
    const options = product.variants || QUANTITY_OPTIONS;

    // Default to first option
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleSizeChange = (e) => {
        const option = options.find(opt => opt.value === e.target.value);
        setSelectedOption(option);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedOption.value, selectedOption.price);
        showToast(`Added ${selectedOption.label} of ${product.name} to cart!`);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-link">
                <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.category && <span className="product-category-tag">{product.category}</span>}
                    {product.id > 8 && <span className="product-new-badge">New</span>}
                </div>
            </Link>

            <div className="product-info">
                <div className="product-rating">
                    <Star size={14} fill="#EAB308" color="#EAB308" />
                    <Star size={14} fill="#EAB308" color="#EAB308" />
                    <Star size={14} fill="#EAB308" color="#EAB308" />
                    <Star size={14} fill="#EAB308" color="#EAB308" />
                    <Star size={14} fill="#EAB308" color="#EAB308" />
                    <span className="review-count">(12)</span>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>

                <p className="product-description">{product.description}</p>

                <div className="product-size-selector">
                    <select
                        value={selectedOption.value}
                        onChange={handleSizeChange}
                        className="size-select"
                    >
                        {options.map((opt, index) => (
                            <option key={`${opt.value}-${index}`} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-footer">
                    <span className="product-price">₹{selectedOption.price}</span>
                    <button className="btn-add-cart" onClick={handleAddToCart}>
                        Add <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
