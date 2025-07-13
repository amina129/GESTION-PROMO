import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
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
        throw new Error('Login failed');
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getAuthHeader: () => {
        const user = authService.getCurrentUser();
        return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
    }
};

export default authService;