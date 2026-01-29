import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>Vasantha Home Made Pickles</h3>
                        <p>Bringing the authentic taste of tradition to your doorstep. Homemade with love and premium ingredients.</p>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/products">Shop All</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <Phone size={16} /> <span>+91 9502389391</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={16} /> <span>vasanthahomemadepickles@gmail.com</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={16} /> <span>Suryapet, Telangana</span>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#"><Facebook size={20} /></a>
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Vasantha Home Made Pickles. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
