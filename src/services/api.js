// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // HAPUS atau setel ke false karena Anda menggunakan JWT (token di header)
    withCredentials: false, 
});

api.interceptors.request.use(
    (config) => {
        // PENTING: Ambil token LANGSUNG dari Local Storage sebelum request
        const token = localStorage.getItem('access_token'); 
        
        if (token) {
            // Tambahkan header Authorization ke SETIAP request
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Tambahkan fungsi untuk mengatur token
export const setAuthToken = (token) => {
    if (token) {
        // Jika ada token, atur header 'Authorization'
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Jika token null, hapus header
        delete api.defaults.headers.common['Authorization'];
    }
};

// Ini memastikan instance 'api' diekspor sebagai default export.
export default api;