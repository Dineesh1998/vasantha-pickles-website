import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <h1 className="about-title">Welcome to Vasantha Home Made Pickles</h1>

                <p className="about-description">
                    Where tradition meets taste in every bite, founded by Vasantha, a passionate YouTuber and dedicated mother, our brand is inspired by her love for homemade delicacies and the joy of sharing them with the world. Named after her beloved daughter, Minnie, our business reflects the warmth and affection that goes into every jar of pickles and snacks we create. At Minnie Inti Ruchulu, we take pride in using only the finest ingredients, sourced locally from the rich agricultural lands of Andhra Pradesh. Our recipes are a perfect blend of time-honored methods and innovative twists, ensuring that each product is not just a treat for your taste buds, but also a journey into the heart of Andhra cuisine. Our commitment to quality and authenticity is unwavering. We believe in preserving the essence of traditional flavors while adapting to the modern palate. Whether it's our tangy Pickle's or our crunchy snacks, every item is crafted with meticulous care and love. Join us in celebrating the culinary heritage of Andhra Pradesh, one delicious bite at a time. Experience the magic of Minnie Inti Ruchulu, where every product tells a story of passion, tradition, and the joy of homemade goodness.
                </p>

                <div className="why-choose-us">
                    <h2 className="why-title">Why Choose Us...</h2>

                    <div className="feature-item">
                        <h3 className="feature-title">High-Quality Ingredients</h3>
                        <p className="feature-desc">Our products are made from the highest quality ingredients, ensuring the best taste and nutrition.</p>
                    </div>

                    <div className="feature-item">
                        <h3 className="feature-title">Handmade with Love</h3>
                        <p className="feature-desc">Each product is handmade with love and care, bringing the warmth of homemade goodness to you.</p>
                    </div>

                    <div className="feature-item">
                        <h3 className="feature-title">Delicious Flavors</h3>
                        <p className="feature-desc">Experience a variety of delicious flavors that will leave you wanting more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
