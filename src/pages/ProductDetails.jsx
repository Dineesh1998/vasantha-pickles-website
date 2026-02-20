import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft } from 'lucide-react';
import { products, QUANTITY_OPTIONS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [product, setProduct] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        // Find product by ID
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            // Set initial option
            const options = foundProduct.variants || QUANTITY_OPTIONS;
            setSelectedOption(options[0]);
        } else {
            // Redirect if not found
            navigate('/products');
        }
    }, [id, navigate]);

    if (!product || !selectedOption) return <div className="loading">Loading...</div>;

    const options = product.variants || QUANTITY_OPTIONS;

    const handleSizeChange = (e) => {
        const option = options.find(opt => opt.value === e.target.value);
        setSelectedOption(option);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedOption.value, selectedOption.price);
        showToast(`Added ${selectedOption.label} of ${product.name} to cart!`);
    };

    return (
        <div className="product-details-page section">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back to Products
                </button>

                <div className="product-details-layout">
                    <div className="product-details-image">
                        <img src={product.image} alt={product.name} />
                        {product.category && <span className="category-tag">{product.category}</span>}
                    </div>

                    <div className="product-details-info">
                        <h1 className="details-title">{product.name}</h1>

                        <div className="details-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={`star-${i}`} size={18} fill="#EAB308" color="#EAB308" />
                                ))}
                            </div>
                            <span className="review-text">(24 customer reviews)</span>
                        </div>

                        <div className="details-price">
                            ₹{selectedOption.price}
                        </div>

                        <p className="details-description">
                            {product.description}
                            <br /><br />
                            Experience the authentic taste of tradition with our {product.name}.
                            Made with hand-picked ingredients and traditional recipes passed down through generations.
                            Zero preservatives, 100% natural taste.
                        </p>

                        <div className="details-actions">
                            <div className="size-selector-container">
                                <label>Select Quantity:</label>
                                <select
                                    value={selectedOption.value}
                                    onChange={handleSizeChange}
                                    className="details-select"
                                >
                                    {options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label} - ₹{opt.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                Add to Cart <ShoppingBag size={20} />
                            </button>
                        </div>

                        <div className="details-meta">
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Freshness:</strong> Made fresh against order</p>
                            <p><strong>Shelf Life:</strong> 6 Months</p>
                            <p><strong>Delivery:</strong> Ships within 2-3 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
