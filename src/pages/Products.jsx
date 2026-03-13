import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = [
    "Veg Pickles",
    "Non-Veg Pickles",
    "Sweets",
    "Snacks",
    "Powders",
    "Spices",
    "Others"
];

const Products = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const categoryFilter = queryParams.get('category');
    const searchQuery = queryParams.get('q');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (categoryFilter) params.category = categoryFilter;
                if (searchQuery) params.search = searchQuery;
                const { data } = await productAPI.getAll(params);
                setProducts(data.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryFilter, searchQuery]);

    const getPageTitle = () => {
        if (searchQuery) return `Search: "${searchQuery}"`;
        if (categoryFilter) return categoryFilter;
        return 'All Products';
    };

    return (
        <div className="products-page section">
            <div className="container">
                <div className="products-header">
                    <h1>{getPageTitle()}</h1>
                    <p>{products.length} items found</p>
                </div>

                <div className="products-layout">
                    <aside className="products-sidebar">
                        <h3>Categories</h3>
                        <ul>
                            <li><Link to="/products" className={!categoryFilter ? 'active' : ''}>All Products</Link></li>
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <Link to={`/products?category=${cat}`} className={categoryFilter === cat ? 'active' : ''}>
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="products-grid">
                        {loading ? (
                            <p style={{ padding: '2rem' }}>Loading products...</p>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-3">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-products">
                                <p>No products found in this category.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
