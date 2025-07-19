// useApi.js
import { useState } from 'react';
import authService from './authService';

export default function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const callApi = async (apiCall) => {
        setLoading(true);
        setError(null);
        try {
            return await apiCall();
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);
            if (err.response?.status === 401) {
                // Handle token expiration
                authService.logout();
                window.location.href = '/login';
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { callApi, loading, error };
}