import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Check for admin hardcoded login
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            let adminUser = await User.findOne({ where: { email } });
            if (!adminUser) {
                adminUser = await User.create({ name: 'Admin', email, password, role: 'admin' });
            }
            return res.json({
                success: true,
                token: generateToken(adminUser.id),
                user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' }
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        res.json({
            success: true,
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get current logged-in user
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};
