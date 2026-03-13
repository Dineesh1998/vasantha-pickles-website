import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import './Auth.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await signup({ name, email, password });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="text-2xl font-bold text-primary">Create Account</h2>
                        <p className="auth-subtitle">
                            Join Vasantha Pickles for exclusive offers and faster checkout
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            className="auth-error"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="name"
                                    className="auth-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    id="password"
                                    className="auth-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Create a strong password"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="auth-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : (
                                <>
                                    Sign Up <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
