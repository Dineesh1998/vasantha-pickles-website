import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// ─── Request Interceptor: attach JWT token to every request ──────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response Interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
    place: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my'),
    getById: (id) => api.get(`/orders/${id}`),
    // Admin
    getAll: () => api.get('/orders'),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

// ─── Addresses ────────────────────────────────────────────────────────────────
export const addressAPI = {
    getAll: () => api.get('/addresses'),
    add: (data) => api.post('/addresses', data),
    delete: (id) => api.delete(`/addresses/${id}`)
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
    createOrder: (amount) => api.post('/payments/create-order', { amount }),
    verify: (data) => api.post('/payments/verify', data)
};

export default api;
