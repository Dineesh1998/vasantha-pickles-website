import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';

dotenv.config();

const products = [
    { name: "Avakaya Pickle", category: "Veg Pickles", basePrice: 300, image: "/images/Avakaya Pickle.jpg", description: "Traditional mango pickle made with premium spices and oil. Tastes like home.", featured: true, variants: [{ label: '250g', value: '250g', price: 300 }, { label: '500g', value: '500g', price: 600 }, { label: '1kg', value: '1kg', price: 1200 }] },
    { name: "Gongura Pickle", category: "Veg Pickles", basePrice: 300, image: "/images/Gongura pickle.jpg", description: "Tangy sorrel leaves pickle, a favorite in Andhra cuisine.", featured: true, variants: [{ label: '250g', value: '250g', price: 300 }, { label: '500g', value: '500g', price: 600 }, { label: '1kg', value: '1kg', price: 1200 }] },
    { name: "Boneless Chicken Pickle", category: "Non-Veg Pickles", basePrice: 300, image: "/images/Boneless chicken pickle.jpg", description: "Spicy and savory boneless chicken chunks pickled to perfection.", featured: true, variants: [{ label: '250g', value: '250g', price: 350 }, { label: '500g', value: '500g', price: 700 }, { label: '1kg', value: '1kg', price: 1400 }] },
    { name: "Prawns Pickle", category: "Non-Veg Pickles", basePrice: 300, image: "/images/Prawns Pickle.jpg", description: "Delicious prawns marinated in rich spices and preserved naturally.", featured: false, variants: [{ label: '250g', value: '250g', price: 350 }, { label: '500g', value: '500g', price: 700 }, { label: '1kg', value: '1kg', price: 1400 }] },
    { name: "Beetroot Janthikalu", category: "Snacks", basePrice: 160, image: "/images/Beetroot jentikalu.jpg", description: "Crunchy snacks infused with the goodness of beetroot.", featured: false, variants: [{ label: '250g', value: '250g', price: 160 }, { label: '500g', value: '500g', price: 320 }, { label: '1kg', value: '1kg', price: 640 }] },
    { name: "Ariselu", category: "Sweets", basePrice: 160, image: "/images/Ariselu.jpg", description: "Traditional sweet made with rice flour and jaggery.", featured: true, variants: [{ label: '250g', value: '250g', price: 160 }, { label: '500g', value: '500g', price: 320 }, { label: '1kg', value: '1kg', price: 640 }] },
    { name: "Karam Podi", category: "Powders", basePrice: 300, image: "/images/karam podi.jpg", description: "Spicy powder to mix with rice or idli, made with lentils and red chillies.", featured: false, variants: [{ label: '250g', value: '250g', price: 180 }, { label: '500g', value: '500g', price: 360 }, { label: '1kg', value: '1kg', price: 720 }] },
    { name: "Tomato Pickle", category: "Veg Pickles", basePrice: 300, image: "/images/tomato pickle.jpg", description: "Sun-dried tomato pickle with a perfect balance of tang and spice.", featured: false, variants: [{ label: '250g', value: '250g', price: 190 }, { label: '500g', value: '500g', price: 380 }, { label: '1kg', value: '1kg', price: 760 }] },
    { name: "Dry Fruits Laddu", category: "Sweets", basePrice: 180, image: "/images/Dry Friuts Laddu.jpg", description: "Healthy and delicious laddu packed with premium dry fruits.", featured: true, variants: [{ label: '250g', value: '250g', price: 180 }, { label: '500g', value: '500g', price: 360 }, { label: '1kg', value: '1kg', price: 760 }] },
    { name: "Mothichur Laddu", category: "Sweets", basePrice: 180, image: "/images/Boondi laddu.jpg", description: "Classic sweet made from gram flour, sugar, and ghee.", featured: false, variants: [{ label: '250g', value: '250g', price: 180 }, { label: '500g', value: '500g', price: 360 }, { label: '1kg', value: '1kg', price: 760 }] },
    { name: "Honey", category: "Others", basePrice: 350, image: "/images/Honey.jpg", description: "Pure and natural organic honey.", featured: true, variants: [{ label: '250g', value: '250g', price: 350 }, { label: '500g', value: '500g', price: 700 }, { label: '1kg', value: '1kg', price: 1400 }] },
    { name: "Mutton Pickle Boneless", category: "Non-Veg Pickles", basePrice: 550, image: "/images/mutton pickle.jpg", description: "Rich and flavourful mutton pickle made with premium spices.", featured: false, variants: [{ label: '250g', value: '250g', price: 550 }, { label: '500g', value: '500g', price: 1100 }, { label: '1kg', value: '1kg', price: 2200 }] },
    { name: "Chicken Pickle (with Bone)", category: "Non-Veg Pickles", basePrice: 600, image: "/images/chicken pickle (with bone).jpg", description: "A traditional chicken pickle that is spicy and flavorful.", featured: false, variants: [{ label: '500g', value: '500g', price: 600 }, { label: '1kg', value: '1kg', price: 1200 }] },
    { name: "Allam Pickle", category: "Veg Pickles", basePrice: 200, image: "/images/Allam Pickle.jpg", description: "A traditional pickle made with ginger, garlic, and spices.", featured: false, variants: [{ label: '250g', value: '250g', price: 200 }, { label: '500g', value: '500g', price: 400 }, { label: '1kg', value: '1kg', price: 800 }] },
    { name: "Lemon Pickle", category: "Veg Pickles", basePrice: 190, image: "/images/lemon pickle.jpg", description: "A traditional pickle made with lemon, garlic, and spices.", featured: false, variants: [{ label: '250g', value: '250g', price: 190 }, { label: '500g', value: '500g', price: 380 }, { label: '1kg', value: '1kg', price: 760 }] },
    { name: "kaju pakam", category: "Sweets", basePrice: 365, image: "/images/kaju pakam.jpg", description: "A traditional sweet made with cashews and bellam.", featured: true, variants: [{ label: '250g', value: '250g', price: 365 }, { label: '500g', value: '500g', price: 730 }, { label: '1kg', value: '1kg', price: 1460 }] },
    { name: "kothimeera pickle", category: "Veg Pickles", basePrice: 187, image: "/images/kothimeera pickle.jpg", description: "A traditional pickle made with coriander and spices.", featured: true, variants: [{ label: '250g', value: '250g', price: 187 }, { label: '500g', value: '500g', price: 374 }, { label: '1kg', value: '1kg', price: 748 }] },
    { name: "Bellam Sunnunda", category: "Sweets", basePrice: 225, image: "/images/Bellam Sunnunda.jpg", description: "A traditional sweet made with lentils and jaggery.", featured: true, variants: [{ label: '250g', value: '250g', price: 225 }, { label: '500g', value: '500g', price: 450 }, { label: '1kg', value: '1kg', price: 850 }] }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        await Product.insertMany(products);
        console.log(`✅ Seeded ${products.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedProducts();
