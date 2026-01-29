import React, { createContext, useContext, useState, useEffect } from 'react';
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
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Create session user (exclude password)
            const sessionUser = { name: foundUser.name, email: foundUser.email, token: 'mock-jwt-' + Date.now() };
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

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
