// router/index.js

import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ChatLayout from "../views/chat/ChatLayout.vue";
import ChatDetailPage from "../views/chat/ChatDetailPage.vue";
import ChatEmptyState from "../components/chat/ChatEmptyState.vue";

// 👇 PENTING: Import Auth Store (Sesuaikan path ini jika berbeda)
import { useAuthStore } from '@/stores/auth.js'; 

const routes = [
  // --- Rute Dasar ---
  { path: "/", redirect: "/chats" }, // Mengarahkan ke chats sebagai halaman utama
  { 
    path: "/login", 
    component: Login, 
    name: 'login' 
  },

  // --- Rute Chat (Memerlukan Otentikasi) ---
  {
    path: "/chats",
    component: ChatLayout,
    name: "chats.base", // Memberi nama pada rute parent (opsional)
    // 👇 Tambahkan meta field untuk menandai rute yang dilindungi
    meta: { requiresAuth: true }, 
    children: [
      {
        // Path: /chats
        path: "",
        name: "chat.empty",
        component: ChatEmptyState,
      },
      {
        // Path: /chats/:id
        path: ":id",
        name: "chat.detail",
        component: ChatDetailPage,
        // (Anda bisa menambahkan guard di sini jika diperlukan, misal: fetch data chat)
      },
    ],
  },
  
  // --- Rute Fallback (404) ---
  { 
    path: '/:catchAll(.*)', 
    name: 'NotFound', 
    redirect: '/chats' // Redirect ke halaman utama jika rute tidak ditemukan
  }
];

// --- Inisialisasi Router ---
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ------------------------------------------------------------------
// Implementasi Global Navigation Guard
// ------------------------------------------------------------------

router.beforeEach((to, from, next) => {
    // 1. Ambil state otentikasi
    const authStore = useAuthStore();
    
    // 2. Cek apakah rute tujuan memerlukan otentikasi
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // 3. Tentukan status login (Gunakan properti token, id, atau sejenisnya dari store Anda)
    const isAuthenticated = authStore.token !== null && authStore.user !== null;

    if (requiresAuth && !isAuthenticated) {
        // Kasus A: Rute dilindungi TAPI pengguna belum login
        
        // Arahkan ke halaman login
        next({ name: 'login' }); 
    } else if (isAuthenticated && to.name === 'login') {
        // Kasus B: Pengguna sudah login TAPI mencoba mengakses halaman login
        
        // Arahkan kembali ke halaman chat utama
        next({ name: 'chat.empty' }); // Mengarahkan ke /chats
    } else {
        // Kasus C: Lanjutkan ke rute tujuan
        next();
    }
});

// --- Export Router ---
export default router;