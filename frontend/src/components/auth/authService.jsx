import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

class AuthService {
    login(username, password) {
        return axios.post(`${API_URL}/login`, { username, password });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }

    getCurrentUser() {
        return localStorage.getItem('username');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService();