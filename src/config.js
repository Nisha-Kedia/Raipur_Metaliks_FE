// API Configuration
// This file centralizes the API base URL configuration

// Determine the API base URL based on the environment
const getApiBaseUrl = () => {
    // Check if we're in production (you can customize this logic)
    const isProduction = import.meta.env.PROD && import.meta.env.VITE_API_URL;

    if (isProduction) {
        // Use environment variable in production
        return import.meta.env.VITE_API_URL;
    }

    // Default to localhost for development
    return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

// You can add other configuration constants here
export const config = {
    apiBaseUrl: API_BASE_URL,
    apiTimeout: 30000, // 30 seconds
};
