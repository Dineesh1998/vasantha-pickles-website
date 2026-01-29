import React from 'react';
import { products, categories } from '../data/products';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Leaf } from 'lucide-react';
import './Home.css';

const Home = () => {
    const featuredProducts = products.filter(p => p.featured);

    return (
        <div className="home-page">
            <Hero />

            {/* Scrolling Banner */}
            <div className="marquee-container">
                <div className="marquee-track">
                    <div className="marquee-content">
                        <span className="marquee-item">☺ No Added Colors</span>
                        <span className="marquee-item">☺ No Palm Oil</span>
                        <span className="marquee-item">☺ No Preservatives</span>
                        <span className="marquee-item">☺ No Added Colors</span>
                        <span className="marquee-item">☺ No Palm Oil</span>
                        <span className="marquee-item">☺ No Preservatives</span>
                        <span className="marquee-item">☺ No Added Colors</span>
                        <span className="marquee-item">☺ No Palm Oil</span>
                        <span className="marquee-item">☺ No Preservatives</span>
                        <span className="marquee-item">☺ No Added Colors</span>
                        <span className="marquee-item">☺ No Palm Oil</span>
                        <span className="marquee-item">☺ No Preservatives</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon"><Leaf size={32} /></div>
                            <h3>100% Natural</h3>
                            <p>No artificial preservatives or colors.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><ShieldCheck size={32} /></div>
                            <h3>Authentic Taste</h3>
                            <p>Made with traditional family recipes.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><Truck size={32} /></div>
                            <h3>Fast Delivery</h3>
                            <p>Fresh from our kitchen to your door.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header-centered">
                        <h2>Our Categories</h2>
                    </div>

                    <div className="categories-wrapper">
                        {/* Shop All */}
                        <Link to="/products" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/background.jpg" />
                            </div>
                            <span>Shop All</span>
                        </Link>

                        {/* Traditional Snacks (Healthy Snacks) */}
                        <Link to="/products?category=Snacks" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/chalimidi.jpg" alt="Snacks" />
                            </div>
                            <span>Healthy Snacks</span>
                        </Link>

                        {/* Newly Added */}
                        <Link to="/products?sort=new" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/Dry Friuts Laddu.jpg" alt="New" style={{ objectFit: 'cover' }} />
                            </div>
                            <span>Newly Added</span>
                        </Link>

                        {/* Sweets */}
                        <Link to="/products?category=Sweets" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/Ariselu.jpg" alt="Sweets" />
                            </div>
                            <span>Sweets</span>
                        </Link>

                        {/* Hot's (assuming specific spicy item or generic) */}
                        <Link to="/products?category=Others" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=200" alt="Hots" />
                            </div>
                            <span>Hot's</span>
                        </Link>

                        {/* Powders */}
                        <Link to="/products?category=Powders" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/karam podi.jpg" alt="Powders" />
                            </div>
                            <span>Powder's</span>
                        </Link>

                        {/* Spices */}
                        <Link to="/products?category=Spices" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200" alt="Spices" />
                            </div>
                            <span>Spice's</span>
                        </Link>

                        {/* Non-Veg */}
                        <Link to="/products?category=Non-Veg Pickles" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/Boneless chicken pickle.jpg" alt="Non-Veg" />
                            </div>
                            <span>Non-Veg Pickles</span>
                        </Link>

                        {/* Veg */}
                        <Link to="/products?category=Veg Pickles" className="category-circle">
                            <div className="cat-img-wrapper">
                                <img src="/images/Avakaya Pickle.jpg" alt="Veg" />
                            </div>
                            <span>Veg Pickles</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Best Sellers</h2>
                        <p>Our customer favorites, handcrafted with love.</p>
                    </div>
                    <div className="grid grid-cols-4">
                        {featuredProducts.slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Sweets Collection */}
            <section className="section sweets-section" style={{ backgroundColor: '#FEF3C7' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Traditional Sweets</h2>
                        <Link to="/products?category=Sweets" className="view-all-link">
                            View All Sweets <ArrowRight size={16} />
                        </Link>
                    </div>
                    <p style={{ marginBottom: '2rem' }}>Authentic homemade sweets made with pure ghee and dry fruits.</p>
                    <div className="grid grid-cols-4">
                        {products.filter(p => p.category === 'Sweets').slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Teaser */}
            <section className="section about-teaser">
                <div className="container">
                    <div className="about-content">
                        <h2>Made with Love, Served with Pride</h2>
                        <p>
                            At Vasantha Home Made Pickles, we believe that food is not just about taste, but about memories.
                            Every jar of pickle and every packet of sweet is made with the same care and dedication
                            as it would be in your own home.
                        </p>
                        <Link to="/about" className="btn btn-outline">Read Our Story</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
