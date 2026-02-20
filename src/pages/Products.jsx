import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const categoryFilter = queryParams.get('category');
    const searchQuery = queryParams.get('q');

    // Debug logging
    console.log('Search Query:', searchQuery);
    console.log('Category Filter:', categoryFilter);

    let filteredProducts = products;

    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(lowerQ) ||
            p.description.toLowerCase().includes(lowerQ)
        );
    }

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
                    <p>{filteredProducts.length} items found</p>
                </div>

                <div className="products-layout">
                    <aside className="products-sidebar">
                        <h3>Categories</h3>
                        <ul>
                            <li><Link to="/products" className={!categoryFilter ? 'active' : ''}>All Products</Link></li>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <Link to={`/products?category=${cat}`} className={categoryFilter === cat ? 'active' : ''}>
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="products-grid">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-3">
                                {filteredProducts.map(product => (
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
