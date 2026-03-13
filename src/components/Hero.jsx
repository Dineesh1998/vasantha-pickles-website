import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-overlay"></div>
            <div className="hero-content container">
                <span className="hero-subtitle">Vasantha Home Made Pickles</span>
                <h1 className="hero-title">Experience the<br />Real Taste of Tradition</h1>
                <p className="hero-description">
                    Handcrafted pickles, powders, and sweets made with grandma's secret recipes.
                    No preservatives, just pure love and nostalgia.
                </p>
                <Link to="/products" className="btn btn-primary">
                    Shop Now <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Link>
            </div>
        </div>
    );
};

export default Hero;
