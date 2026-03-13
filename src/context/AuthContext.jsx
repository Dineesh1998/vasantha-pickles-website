import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from './ToastContext';
import { authAPI, addressAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { showToast } = useToast();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    // ─── Login ───────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            showToast(`Welcome back, ${data.user.name}!`, 'success');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed.';
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // ─── Signup ──────────────────────────────────────────────────────────────
    const signup = useCallback(async (userData) => {
        try {
            setLoading(true);
            const { data } = await authAPI.register(userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            showToast(`Welcome to Vasantha Pickles, ${data.user.name}! 🎉`, 'success');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // ─── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast('Successfully logged out.', 'info');
    }, [showToast]);

    // ─── Google Login (placeholder - requires backend OAuth setup) ────────────
    const loginWithGoogle = useCallback(() => {
        showToast('Google login requires backend OAuth configuration.', 'info');
    }, [showToast]);

    // ─── Address Management ─────────────────────────────────────────────────
    const getAddresses = useCallback(async () => {
        try {
            const { data } = await addressAPI.getAll();
            return data.addresses;
        } catch {
            return [];
        }
    }, []);

    const saveAddress = useCallback(async (address) => {
        try {
            const { data } = await addressAPI.add(address);
            showToast('Address saved successfully!', 'success');
            return data.addresses;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save address.';
            showToast(message, 'error');
            return null;
        }
    }, [showToast]);

    const deleteAddress = useCallback(async (addressId) => {
        try {
            await addressAPI.delete(addressId);
            showToast('Address removed.', 'info');
        } catch {
            showToast('Failed to remove address.', 'error');
        }
    }, [showToast]);

    // ─── Context Value ───────────────────────────────────────────────────────
    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        signup,
        loginWithGoogle,
        saveAddress,
        getAddresses,
        deleteAddress,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    }), [user, loading, login, logout, signup, loginWithGoogle, saveAddress, getAddresses, deleteAddress]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
