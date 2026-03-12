import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    label: { type: String, required: true },   // e.g. "250g"
    value: { type: String, required: true },   // e.g. "250g"
    price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    variants: [variantSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
