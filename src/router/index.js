import { createRouter, createWebHistory } from 'vue-router'
// Import Views sesuai penamaan teman Anda
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue' // Pastikan file ini ada atau buat dummy dulu
// Import view lain jika sudah ada file-nya di tempat Anda, jika belum, bisa di-comment dulu
// import BookmarksView from '../views/BookmarksView.vue'
// import ProfileView from '../views/ProfileView.vue'
// import Sharing from '../views/Sharing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false } // Kita set False agar publik bisa akses
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    // Route milik teman Anda (aktifkan jika file view-nya sudah Anda buat/copy)
    /*
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: BookmarksView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sharing',
      name: 'sharing',
      component: Sharing,
      meta: { requiresAuth: true }
    }
    */
  ]
})

// Navigation Guard (Simpel)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router