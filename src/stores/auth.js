// src/stores/authStore.js

import { defineStore } from 'pinia';
import { login as loginService, logout as logoutService } from '@/services/auth';
import { setAuthToken } from '@/services/api'; 
// 👇 Import Pinia store lain yang perlu di-reset
import { useChatStore } from '@/stores/chat/useChatStore'; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('access_token') || null, 
        user: JSON.parse(localStorage.getItem('user')) || null,
    }),
    
    // 👇 Tambahkan getter untuk memudahkan pengecekan status login
    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        
        async login(credentials) {
            const response = await loginService(credentials);
            
            const token = response.data.data.access_token;
            const user = response.data.data.user;

            // 1. Simpan ke State
            this.token = token;
            this.user = user;

            // 2. Simpan ke Local Storage
            localStorage.setItem('access_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 3. SET AXIOS HEADER
            setAuthToken(token); 
        },

        async logout() {
            try {
                // Panggil service logout (opsional, tergantung backend)
                await logoutService();
            } catch (error) {
                console.error("Logout API failed, proceeding with local reset:", error);
                // Lanjutkan reset lokal meskipun API gagal (misalnya token sudah kedaluwarsa)
            }
            
            // --- 1. RESET STATE PINIA LAIN ---
            // Dapatkan instance store yang perlu dibersihkan
            const chatStore = useChatStore();
            
            // Lakukan reset Pinia
            chatStore.$reset(); 
            
            // --- 2. RESET STATE AUTH LOKAL ---
            this.token = null;
            this.user = null;
            
            // --- 3. HAPUS DATA LOKAL ---
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            
            // --- 4. HAPUS TOKEN AXIOS ---
            setAuthToken(null);

            // --- 5. PERBAIKAN PENTING: HARD REDIRECT ---
            // Mengganti router.push() dengan window.location.href 
            // memaksa browser memuat halaman dari awal, menyelesaikan masalah tampilan stuck.
            window.location.href = '/login'; 
        },

        initialize() {
            const token = localStorage.getItem('access_token');
            if (token) {
                this.token = token;
                // Ini yang PENTING: Mengatur header di Axios saat aplikasi dimuat ulang
                setAuthToken(token); 
            }
        }
    }
});