import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // HAPUS atau setel ke false karena Anda menggunakan JWT (token di header)
    withCredentials: false, 
});

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
