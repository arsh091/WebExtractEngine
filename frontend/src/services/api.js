import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const extractDataFromUrl = async (url, token = null) => {
    try {
        const response = await axios.post(`${API_URL}/extract`, { url }, {
            timeout: 50000, // 50s frontend timeout
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
            throw new Error('Analysis is taking longer than expected. Please try again.');
        }
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(
            error.response?.data?.error || 'Failed to extract data'
        );
    }
};

export const testApiHealth = async () => {
    try {
        const response = await axios.get(`${API_URL}/health`);
        return response.data;
    } catch (error) {
        throw new Error('API is not responding');
    }
};
