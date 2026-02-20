import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import emailjs from '@emailjs/browser';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { showToast } = useToast();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init("4AHLRo_249jahVfUB");
    }, []);

    // Login with validation against local storage database
    const login = (email, password) => {
        // Hardcoded Admin Access
        if (email === 'admin@pickles.com' && password === 'admin123') {
            const adminUser = { name: 'Admin', email: 'admin@pickles.com', role: 'admin', token: 'admin-token' };
            setUser(adminUser);
            localStorage.setItem('user', JSON.stringify(adminUser));
            showToast('Welcome back, Admin!', 'success');
            return true;
        }

        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Create session user (exclude password)
            const role = foundUser.email === 'admin@pickles.com' ? 'admin' : 'customer';
            const sessionUser = { name: foundUser.name, email: foundUser.email, role, token: 'mock-jwt-' + Date.now() };
            setUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
            showToast(`Welcome back, ${foundUser.name}!`, 'success');
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        showToast('Successfully logged out');
    };

    // Signup with EmailJS integration
    const signup = async (userData) => {
        const { name, email, password } = userData;
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

        if (registeredUsers.some(u => u.email === email)) {
            return { success: false, message: 'User with this email already exists.' };
        }

        // Save new user
        const newUser = { name, email, password };
        localStorage.setItem('registered_users', JSON.stringify([...registeredUsers, newUser]));

        // Auto login after signup
        login(email, password);

        // Send Email via EmailJS
        try {
            await emailjs.send(
                'service_3i1x59k',
                'template_cgxtkwq',
                {
                    to_name: name,
                    to_email: email,
                    message: 'Welcome to Vasantha Home Made Pickles! We are excited to have you.'
                },
                '4AHLRo_249jahVfUB'
            );

            showToast('📩 Welcome email sent to ' + email, 'success');
            console.log('Email sent successfully via EmailJS');

        } catch (error) {
            console.error('Email sending failed:', error);
            showToast('Account created, but failed to send email.', 'warning');
        }

        return { success: true };
    };

    // Mock Google Login
    const loginWithGoogle = () => {
        const googleUser = {
            name: 'Google User',
            email: 'user@gmail.com',
            token: 'mock-google-token-' + Date.now(),
            provider: 'google'
        };
        setUser(googleUser);
        localStorage.setItem('user', JSON.stringify(googleUser));
        showToast('Successfully signed in with Google!', 'success');
        return true;
    };

    // Address Management
    const saveAddress = (address) => {
        if (!user) return;
        const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '{}');
        const userAddresses = savedAddresses[user.email] || [];

        // Check if address already exists to avoid duplicates
        const exists = userAddresses.some(a =>
            a.address === address.address && a.city === address.city && a.zipCode === address.zipCode
        );

        if (!exists) {
            const newAddresses = [...userAddresses, { ...address, id: Date.now() }];
            savedAddresses[user.email] = newAddresses;
            localStorage.setItem('user_addresses', JSON.stringify(savedAddresses));
            showToast('Address saved successfully!', 'success');
        }
    };

    const getAddresses = () => {
        if (!user) return [];
        const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '{}');
        return savedAddresses[user.email] || [];
    };

    const deleteAddress = (addressId) => {
        if (!user) return;
        const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '{}');
        const userAddresses = savedAddresses[user.email] || [];
        const newAddresses = userAddresses.filter(a => a.id !== addressId);
        savedAddresses[user.email] = newAddresses;
        localStorage.setItem('user_addresses', JSON.stringify(savedAddresses));
        showToast('Address removed', 'info');
    };

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        signup,
        loginWithGoogle,
        saveAddress,
        getAddresses,
        deleteAddress,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    }), [user, login, logout, signup, loginWithGoogle, saveAddress, getAddresses, deleteAddress]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
