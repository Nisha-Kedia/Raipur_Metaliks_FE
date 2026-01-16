// API Service
// Centralized API service for making HTTP requests

import { API_BASE_URL } from '../config';

/**
 * Makes an API request with the configured base URL
 * @param {string} endpoint - The API endpoint (e.g., '/api/login')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - The fetch promise
 */
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
    };

    try {
        const response = await fetch(url, config);
        return response;
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Convenience methods for common HTTP verbs
export const api = {
    get: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, data, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        }),

    put: (endpoint, data, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

// Specific API endpoints
export const authAPI = {
    login: (credentials) => api.post('/api/login', credentials),
};

export const metalAPI = {
    addMetalPrice: (data) => api.post('/api/metalvsday', data),
    getMetalVsDay: () => api.get('/api/getmetalvsday'),
};

export const buyerAPI = {
    getBuyers: () => api.get('/api/getbuyers'),
    addBuyer: (data) => api.post('/api/Buyerform', data),
};

export const saudaAPI = {
    getAllSaudas: () => api.get('/api/sauda'),
    getSaudaById: (id) => api.get(`/api/sauda/${id}`),
    createSauda: (data) => api.post('/api/sauda', data),
    updateSauda: (id, data) => api.put(`/api/sauda/${id}`, data),
    deleteSauda: (id) => api.delete(`/api/sauda/${id}`),
};

