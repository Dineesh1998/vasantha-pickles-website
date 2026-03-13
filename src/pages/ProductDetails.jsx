import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await productAPI.getById(id);
                if (data.product) {
                    setProduct(data.product);
                    const options = data.product.variants || [];
                    setSelectedOption(options[0]);
                } else {
                    navigate('/products');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                showToast('Failed to load product details.', 'error');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate, showToast]);

    if (loading) {
        return (
            <div className="section product-details-page">
                <div className="container loading-container">
                    <Loader2 size={40} className="spin-icon" />
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product || !selectedOption) return null;

    const options = product.variants || [];

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
                                {['star-1', 'star-2', 'star-3', 'star-4', 'star-5'].map((starId) => (
                                    <Star key={starId} size={18} fill="#EAB308" color="#EAB308" />
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
