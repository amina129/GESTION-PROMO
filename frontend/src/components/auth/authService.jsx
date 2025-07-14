import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL
});

// Add request interceptor to inject token
api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                const user = {
                    token: response.data.token,
                    email: response.data.email,
                    fonction: response.data.fonction,
                    id: response.data.id
                };
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            throw new Error('Login failed: No token received');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Example authenticated API call
    searchPromotions: (params) => api.get('/promotions/search', { params }),

    // General API method for other endpoints
    api: api
};

export default authService;