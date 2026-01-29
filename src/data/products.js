export const products = [
    {
        id: 1,
        name: "Avakaya Pickle",
        category: "Veg Pickles",
        basePrice: 300,
        image: "/images/Avakaya Pickle.jpg",
        description: "Traditional mango pickle made with premium spices and oil. Tastes like home.",
        featured: true
    },
    {
        id: 2,
        name: "Gongura Pickle",
        category: "Veg Pickles",
        basePrice: 300,
        image: "/images/Gongura pickle.jpg",
        description: "Tangy sorrel leaves pickle, a favorite in Andhra cuisine.",
        featured: true
    },
    {
        id: 3,
        name: "Boneless Chicken Pickle",
        category: "Non-Veg Pickles",
        basePrice: 300,
        image: "/images/Boneless chicken pickle.jpg",
        description: "Spicy and savory boneless chicken chunks pickled to perfection.",
        featured: true
    },
    {
        id: 4,
        name: "Prawns Pickle",
        category: "Non-Veg Pickles",
        basePrice: 300,
        image: "/images/Prawns Pickle.jpg",
        description: "Delicious prawns marinated in rich spices and preserved naturally.",
        featured: false
    },
    {
        id: 5,
        name: "Beetroot Janthikalu",
        category: "Snacks",
        basePrice: 300,
        image: "https://images.unsplash.com/photo-1608755717536-93d35a852d5a?q=80&w=800&auto=format&fit=crop",
        description: "Crunchy snacks infused with the goodness of beetroot.",
        featured: false
    },
    {
        id: 6,
        name: "Ariselu",
        category: "Sweets",
        basePrice: 300,
        image: "/images/Ariselu.jpg",
        description: "Traditional sweet made with rice flour and jaggery.",
        featured: true
    },
    {
        id: 7,
        name: "Karam Podi",
        category: "Powders",
        basePrice: 300,
        image: "/images/karam podi.jpg",
        description: "Spicy powder to mix with rice or idli, made with lentils and red chillies.",
        featured: false
    },
    {
        id: 8,
        name: "Tomato Pickle",
        category: "Veg Pickles",
        basePrice: 300,
        image: "/images/tomato pickle.jpg",
        description: "Sun-dried tomato pickle with a perfect balance of tang and spice.",
        featured: false
    },
    // New Sweet Products
    {
        id: 9,
        name: "Dry Fruits Laddu",
        category: "Sweets",
        basePrice: 180,
        image: "/images/Dry Friuts Laddu.jpg",
        description: "Healthy and delicious laddu packed with premium dry fruits.",
        featured: true,
        variants: [
            { label: '250g', value: '250g', price: 180 },
            { label: '500g', value: '500g', price: 360 },
            { label: '1kg', value: '1kg', price: 760 }
        ]
    },
    {
        id: 10,
        name: "Mothichur Laddu",
        category: "Sweets",
        basePrice: 180,
        image: "/images/Boondi laddu.jpg",
        description: "Classic sweet made from gram flour, sugar, and ghee.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 180 },
            { label: '500g', value: '500g', price: 360 },
            { label: '1kg', value: '1kg', price: 760 }
        ]
    },
    {
        id: 11,
        name: "Boondi Achu",
        category: "Sweets",
        basePrice: 165,
        image: "/images/Boondi Achu.jpg",
        description: "Crispy sweet boondi clusters.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 165 },
            { label: '500g', value: '500g', price: 325 }
        ]
    },
    {
        id: 12,
        name: "Palli Chakki",
        category: "Sweets",
        basePrice: 180,
        image: "/images/Palli Chakki.jpg",
        description: "Classic sweet made from gram flour, sugar, and ghee.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 160 },
            { label: '500g', value: '500g', price: 320 },
            { label: '1kg', value: '1kg', price: 640 }
        ]
    },
    {
        id: 12,
        name: "Chalimidi",
        category: "Sweets",
        basePrice: 170,
        image: "/images/chalimidi.jpg",
        description: "Traditional sweet dish made with rice flour and jaggery/sugar.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 170 },
            { label: '500g', value: '500g', price: 300 },
            { label: '1kg', value: '1kg', price: 600 }
        ]
    },
    {
        id: 13,
        name: "Gavvalu",
        category: "Sweets",
        basePrice: 160,
        image: "/images/Gavvalu.jpg",
        description: "Shell-shaped traditional sweet crispy snacks.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 160 },
            { label: '500g', value: '500g', price: 300 },
            { label: '1kg', value: '1kg', price: 600 }
        ]
    },
    {
        id: 14,
        name: "Honey",
        category: "Others",
        basePrice: 350,
        image: "/images/Honey.jpg",
        description: "Pure and natural organic honey.",
        featured: true,
        variants: [
            { label: '250g', value: '250g', price: 350 },
            { label: '500g', value: '500g', price: 700 },
            { label: '1kg', value: '1kg', price: 1400 }
        ]
    },
    {
        id: 15,
        name: "Kajjikayalu",
        category: "Sweets",
        basePrice: 350,
        image: "/images/kajjikayalu.jpg",
        description: "Crispy fried dumplings stuffed with sweet coconut filling.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 300 },
            { label: '500g', value: '500g', price: 550 },
            { label: '1kg', value: '1kg', price: 700 }
        ]
    },
    {
        id: 16
        ,
        name: "Mutton Pickle Boneless",
        category: "Non-Veg Pickles",
        basePrice: 350,
        image: "/images/mutton pickle.jpg",
        description: "Rich and creamy Mutton Pickle Boneless made with ghee, sugar, and gram flour.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 550 },
            { label: '500g', value: '500g', price: 1100 },
            { label: '1kg', value: '1kg', price: 2200 }
        ]
    },
    {
        id: 17,
        name: "Chicken pickle (with Bone)",
        category: "Non-Veg Pickles",
        basePrice: 600,
        image: "/images/chicken pickle (with bone).jpg",
        description: "A traditional chicken pickle that is spicy and flavorful.",
        featured: false,
        variants: [
            { label: '500g', value: '500g', price: 600 },
            { label: '1kg', value: '1kg', price: 1200 },
        ]
    },
    {
        id: 18,
        name: "Allam Pickle",
        category: "Veg Pickles",
        basePrice: 600,
        image: "/images/Allam Pickle.jpg",
        description: "A traditional pickle made with ginger, garlic, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 200 },
            { label: '500g', value: '500g', price: 400 },
            { label: '1kg', value: '1kg', price: 800 },
        ]
    },
    {
        id: 19,
        name: "Cauliflower Pickle",
        category: "Veg Pickles",
        basePrice: 190,
        image: "/images/Cauliflower pickle.jpg",
        description: "A traditional pickle made with cauliflower, garlic, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 190 },
            { label: '500g', value: '500g', price: 380 },
            { label: '1kg', value: '1kg', price: 760 },
        ]
    },
    {
        id: 20,
        name: "Chintakaya Pandumirchi",
        category: "Veg Pickles",
        basePrice: 190,
        image: "/images/Chintakaya Pandumirchi.jpg",
        description: "A traditional pickle made with Tamarind, green chillies, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 190 },
            { label: '500g', value: '500g', price: 380 },
            { label: '1kg', value: '1kg', price: 760 },
        ]
    },
    {
        id: 21,
        name: "Lemon Pickle",
        category: "Veg Pickles",
        basePrice: 190,
        image: "/images/lemon pickle.jpg",
        description: "A traditional pickle made with lemon, garlic, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 190 },
            { label: '500g', value: '500g', price: 380 },
            { label: '1kg', value: '1kg', price: 760 },
        ]
    },
    {
        id: 22,
        name: "Onion Pickle",
        category: "Veg Pickles",
        basePrice: 190,
        image: "/images/Onion pickle.jpg",
        description: "A traditional pickle made with onion, garlic, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 190 },
            { label: '500g', value: '500g', price: 380 },
            { label: '1kg', value: '1kg', price: 760 },
        ]
    },
    {
        id: 23,
        name: "Usirikaya Pickle(Amla)",
        category: "Veg Pickles",
        basePrice: 190,
        image: "/images/Amla pickle.jpg",
        description: "A traditional pickle made with Amla, garlic, and spices.",
        featured: false,
        variants: [
            { label: '250g', value: '250g', price: 190 },
            { label: '500g', value: '500g', price: 380 },
            { label: '1kg', value: '1kg', price: 760 },
        ]
    }

];

export const QUANTITY_OPTIONS = [
    { label: '250g', value: '250g', price: 300 },
    { label: '500g', value: '500g', price: 750 },
    { label: '1kg', value: '1kg', price: 1500 }
];

export const categories = [
    "Veg Pickles",
    "Non-Veg Pickles",
    "Sweets",
    "Snacks",
    "Powders",
    "Spices",
    "Others"
];
