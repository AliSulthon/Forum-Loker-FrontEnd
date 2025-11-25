<template>
  <nav 
    v-if="isLoggedIn"
    class="backdrop-blur-md bg-white/70 border-b border-gray-200 sticky top-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

      <!-- LEFT: Logo + Title -->
      <div class="flex items-center gap-3">
        <img 
          src="/src/assets/logo.png"
          alt="Logo"
          class="w-12 h-12 object-contain"
        />
        <h1 class="text-4xl font-semibold text-primary font-namaApp">Sevanta</h1>
      </div>

      <!-- CENTER: Navigation -->
      <div class="flex items-center gap-6">
<<<<<<< HEAD
=======
        <!-- HOME -->
>>>>>>> main
        <RouterLink 
          to="/"
          :class="[
            'px-3 py-2 rounded-md transition',
            $route.path === '/' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary hover:text-white'
          ]"
        >
          Home
        </RouterLink>

        <RouterLink 
          to="/communities"
          :class="[
            'px-3 py-2 rounded-md transition',
            $route.path.startsWith('/communities') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary hover:text-white'
          ]"
        >
          Communities
        </RouterLink>

        <RouterLink 
          to="/articles"
          :class="[
            'px-3 py-2 rounded-md transition',
            $route.path.startsWith('/articles') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary hover:text-white'
          ]"
        >
          Articles
        </RouterLink>

        <RouterLink 
          to="/sharing"
          :class="[
            'px-3 py-2 rounded-md transition',
            $route.path.startsWith('/sharing') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary hover:text-white'
          ]"
        >
          Sharing
        </RouterLink>
      </div>

      <!-- RIGHT: Icons -->
      <div class="flex items-center gap-3">
        <RouterLink 
          to="/chat"
<<<<<<< HEAD
          :class="[
            'p-2 rounded-full transition flex items-center justify-center',
            $route.path.startsWith('/chat') ? 'bg-white text-white' : 'bg-white text-white hover:bg-primary-dark'
          ]"
=======
          class="p-2 rounded-full transition flex items-center justify-center bg-white hover:bg-primary-dark"
>>>>>>> main
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            stroke-width="2" stroke="currentColor"
            class="w-8 h-8 text-primary">
            <path stroke-linecap="round" stroke-linejoin="round" 
            d="M8.625 4.5h6.75c1.875 0 3.375 1.5 3.375 3.375v5.25
            c0 1.875-1.5 3.375-3.375 3.375H12l-4.125 3v-3H6
            A3.375 3.375 0 0 1 2.625 13.125v-5.25
            C2.625 6 4.125 4.5 6 4.5h2.625z" />
          </svg>
        </RouterLink>

<<<<<<< HEAD
        <RouterLink 
          to="/profile"
          :class="[
            'p-2 rounded-full transition flex items-center justify-center',
            $route.path.startsWith('/profile')
              ? 'bg-primary-dark text-white'
              : 'bg-primary text-white hover:bg-primary-dark'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            stroke-width="2" stroke="currentColor"
            class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 
              20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z" />
          </svg>
        </RouterLink>
=======
        <!-- PROFILE DROPDOWN -->
        <div class="relative" ref="profileRef">
          <button 
            @click="toggleProfile"
            class="p-2 rounded-full transition flex items-center justify-center bg-primary text-white hover:bg-primary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor"
              class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 
                20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75z" />
            </svg>
          </button>

          <!-- POPUP MENU -->
          <div 
            v-if="showProfileMenu"
            class="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 animate-fadeIn"
          >
            <RouterLink 
              to="/profile"
              class="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition"
            >
              My Profile
            </RouterLink>

            <RouterLink 
              to="/settings"
              class="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition"
            >
              Settings
            </RouterLink>

            <button 
              class="block text-left w-full px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
>>>>>>> main

      </div>
    </div>
  </nav>
</template>

<script setup>
<<<<<<< HEAD
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const router = useRouter();

// cek login dari pinia
const isLoggedIn = computed(() => authStore.isLoggedIn);

const handleLogout = async () => {
  await authStore.logout();
  alert('Logout berhasil!');
  router.push('/login');
};
=======
import { ref, onMounted, onBeforeUnmount } from "vue";

const showProfileMenu = ref(false);
const profileRef = ref(null);

const toggleProfile = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

// CLOSE POPUP WHEN CLICK OUTSIDE
const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    showProfileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
>>>>>>> main
</script>
