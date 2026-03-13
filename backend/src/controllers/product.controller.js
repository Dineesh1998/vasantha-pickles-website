import Product from '../models/Product.model.js';
import { Op } from 'sequelize';

// @desc   Get all products (with optional category filter & search)
// @route  GET /api/products
// @access Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        const where = {};

        if (category && category !== 'All') where.category = category;
        if (featured === 'true') where.featured = true;
        if (search) where.name = { [Op.like]: `%${search}%` };

        const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get a single product by ID
// @route  GET /api/products/:id
// @access Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Create a new product
// @route  POST /api/products
// @access Admin Only
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Admin Only
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        await product.update(req.body);
        res.json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Admin Only
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        await product.destroy();
        res.json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
