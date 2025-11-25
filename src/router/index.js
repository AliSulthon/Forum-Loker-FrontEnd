import { createRouter, createWebHistory } from "vue-router";

// --- Import Halaman ---
import Login from "../views/Login.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import BookmarksView from "../views/BookmarksView.vue";
import Sharing from "../views/Sharing.vue";
import SharingDetail from "../views/SharingDetail.vue";

import ChatLayout from "../views/chat/ChatLayout.vue";
import ChatDetailPage from "../views/chat/ChatDetailPage.vue";
import ChatEmptyState from "../components/chat/ChatEmptyState.vue";

import MainLayout from "../layouts/MainLayout.vue"; // Layout utama non-chat

// 👇 PENTING: Import Auth Store (Sesuaikan path ini jika berbeda)
import { useAuthStore } from '@/stores/auth.js'; 

// --- Definisi Rute ---
const routes = [
    // --- Rute Login ---
    { 
        path: "/login", 
        component: Login, 
        name: 'login' 
    },

    // --- Rute Layout Utama (MainLayout) ---
    {
        path: "/",
        component: MainLayout,
        // Semua rute di children ini tidak memerlukan otentikasi
        children: [
            { path: "", name: "home", component: HomeView },
            { path: "profile", name: "profile", component: ProfileView, meta: { requiresAuth: true } }, // Contoh rute dilindungi
            { path: "bookmarks", name: "bookmarks", component: BookmarksView, meta: { requiresAuth: true } }, // Contoh rute dilindungi
            { path: "sharing", name: "sharing", component: Sharing },
            { path: "sharing/:id", name: "SharingDetail", component: SharingDetail }
        ]
    },

    // --- Rute Chat (Memerlukan Otentikasi & Menggunakan ChatLayout) ---
    {
        path: "/chats",
        component: ChatLayout,
        name: "chats.base", 
        meta: { requiresAuth: true }, // Rute parent melindungi semua children
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
            },
        ],
    },
    
    // --- Rute Fallback (404) ---
    { 
        path: '/:catchAll(.*)', 
        name: 'NotFound', 
        redirect: '/' // Redirect ke halaman utama jika rute tidak ditemukan
    }
];

// --- Inisialisasi Router ---
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ------------------------------------------------------------------
// Implementasi Global Navigation Guard (Menggunakan Logic Kode Pertama)
// ------------------------------------------------------------------

router.beforeEach((to, from, next) => {
    // 1. Ambil state otentikasi
    const authStore = useAuthStore();
    
    // 2. Cek apakah rute tujuan memerlukan otentikasi
    // 'to.matched.some' akan memeriksa *meta* di rute tujuan DAN rute parent-nya.
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // 3. Tentukan status login (Sesuaikan properti store jika berbeda)
    const isAuthenticated = authStore.token !== null && authStore.user !== null;

    if (requiresAuth && !isAuthenticated) {
        // Kasus A: Rute dilindungi TAPI pengguna belum login
        
        // Arahkan ke halaman login
        next({ name: 'login' }); 
    } else if (isAuthenticated && to.name === 'login') {
        // Kasus B: Pengguna sudah login TAPI mencoba mengakses halaman login
        
        // Arahkan kembali ke halaman utama yang paling masuk akal (HomeView)
        next({ name: 'home' }); // Mengarahkan ke /
    } else {
        // Kasus C: Lanjutkan ke rute tujuan
        next();
    }
});

// --- Export Router ---
export default router;