import Product from '../models/Product.model.js';

// @desc   Get all products (with optional category filter & search)
// @route  GET /api/products
// @access Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        const filter = {};

        if (category && category !== 'All') filter.category = category;
        if (featured === 'true') filter.featured = true;
        if (search) filter.name = { $regex: search, $options: 'i' };

        const products = await Product.find(filter).sort({ createdAt: -1 });
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
        const product = await Product.findById(req.params.id);
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
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
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
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
