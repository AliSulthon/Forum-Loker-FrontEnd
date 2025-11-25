// src/services/auth.js (Pastikan ini yang Anda gunakan)

import axios from "@/services/api.js"; 

export const login = (credentials) => {
    // Credentials adalah objek { email, password }
    return axios.post(`/login`, credentials); 
};

export const logout = () => {
    // Panggil endpoint logout
    return axios.post(`/logout`); 
};

// Pastikan file ini tidak lagi memiliki export 'loginUser'