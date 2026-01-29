import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, selectedSize, selectedPrice) => {
        setCart(prevCart => {
            // Create a unique ID based on product ID AND size selected
            const uniqueId = `${product.id}-${selectedSize}`;

            const existingItem = prevCart.find(item => item.uniqueId === uniqueId);

            if (existingItem) {
                return prevCart.map(item =>
                    item.uniqueId === uniqueId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevCart, {
                ...product,
                uniqueId: uniqueId,
                size: selectedSize,
                price: selectedPrice, // Store the specific price for this size
                quantity: 1
            }];
        });
    };

    const removeFromCart = (uniqueId) => {
        setCart(prevCart => prevCart.filter(item => item.uniqueId !== uniqueId));
    };

    const updateQuantity = (uniqueId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.uniqueId === uniqueId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
