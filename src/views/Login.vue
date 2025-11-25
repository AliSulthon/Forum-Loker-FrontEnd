<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold font-namaApp text-primary">Sevanta Login</h1>
        <p class="text-gray-500 mt-2 text-sm">Masuk untuk mulai berdiskusi</p>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="nama@email.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        Belum punya akun? 
        <a href="#" class="text-primary font-medium hover:underline">Daftar sekarang</a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// Import ini sekarang akan berhasil karena kita sudah update vite.config.js
import { loginUser } from "@/services/auth.js"; 

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    await loginUser({ 
      email: email.value, 
      password: password.value 
    });
    // Redirect ke home setelah login sukses
    router.push("/"); 
  } catch (error) {
    errorMessage.value = error.message || "Email atau password salah.";
  } finally {
    loading.value = false;
  }
};
</script>