// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Cek KEDUA storage
        const token = localStorage.getItem('auth_token') || 
                      sessionStorage.getItem('auth_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token injected from storage'); 
        } else {
            console.warn('No token found in storage'); 
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message
        });
    
        const isLoginRequest = error.config?.url?.includes('/login'); 

        // Handle 401 Unauthorized
    
        if (error.response?.status === 401 && !isLoginRequest) {
            console.warn('🚪 401 Unauthorized (Session Expired) - Logging out...');
            
            // Clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_info');
            
            // Redirect to login
            window.location.href = '/login';
        }
        
        // (catch block)
        return Promise.reject(error);
    }
);

export default api;