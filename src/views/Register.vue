<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative p-4 font-sans overflow-hidden">

    <!-- BACKGROUND DOTS -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none"
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <!-- BACKGROUND COLOR BLOB -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blueLight rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blueHeadline rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>

    <div class="z-10 bg-base shadow-2xl rounded-[30px] flex flex-col md:flex-row w-full max-w-5xl overflow-hidden animate-fadein border border-white/50">

      <!-- LEFT SIDE (SAME AS LOGIN) -->
      <div class="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-blueHeadline to-bluePrimary p-10 lg:p-14 text-base flex-col justify-center relative overflow-hidden">
        
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-blueLight rounded-full mix-blend-overlay opacity-50 blur-2xl"></div>
        <div class="absolute -bottom-32 -left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay opacity-20 blur-3xl"></div>

        <div class="relative z-10">
          <img 
            src="/src/assets/logo.png"
            alt="Logo" 
            class="w-28 mb-8 drop-shadow-md hover:scale-105 transition-transform duration-300"
          >

          <h2 class="font-namaApp text-3xl font-bold mb-2 uppercase tracking-wide opacity-90">Welcome to</h2>
          <h1 class="font-namaApp text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-sm leading-tight">
            FORUM<br>LOKER
          </h1>
          <p class="text-blue-50 text-sm leading-relaxed font-medium opacity-90 max-w-xs">
            Daftar untuk bergabung dengan komunitas pencari kerja dan mulai berbagi informasi peluang karir.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE (REGISTER FORM) -->
      <div class="w-full md:w-[55%] bg-base p-8 lg:p-16 flex flex-col justify-center">

        <div class="text-center mb-6">
          <div class="flex justify-center md:hidden mb-6">
            <img src="/src/assets/logo.png" alt="Logo" class="w-24 drop-shadow-sm">
          </div>

          <h2 class="text-3xl font-bold text-headline font-namaApp tracking-tight">Create Account</h2>
          <p class="text-detail text-sm mt-2 font-medium">
            Daftar untuk membuat akun baru
          </p>
        </div>

        <!-- ERROR MESSAGE -->
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fadein">
          <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="text-sm text-red-600 font-medium">
            {{ errorMessage }}
          </div>
        </div>

        <!-- REGISTER FORM -->
        <form class="space-y-6" @submit.prevent="handleRegister">

          <!-- USERNAME -->
          <div class="relative group">
            <input
              v-model="form.username"
              type="text"
              placeholder="Username"
              class="input-field"
              required
            />
          </div>

          <!-- FULL NAME -->
          <div class="relative group">
            <input
              v-model="form.fullname"
              type="text"
              placeholder="Nama Lengkap"
              class="input-field"
              required
            />
          </div>

          <!-- EMAIL -->
          <div class="relative group">
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="input-field"
              required
            />
          </div>

          <!-- BIO -->
          <div class="relative group">
            <input
              v-model="form.bio"
              type="text"
              placeholder="Bio"
              class="input-field"
            />
          </div>

          <!-- CONTACT -->
          <div class="relative group">
            <input
              v-model="form.contact"
              type="text"
              placeholder="Kontak"
              class="input-field"
            />
          </div>

          <!-- PASSWORD -->
          <div class="relative group">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="input-field pr-16"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="relative group">
            <input
              v-model="form.password_confirmation"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Konfirmasi Password"
              class="input-field pr-16"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <!-- SUBMIT -->
          <button
            type="submit"
            :disabled="isLoading"
            class="submit-btn"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                       1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>

            <span v-if="!isLoading">Daftar</span>
            <span v-else>Memproses...</span>
          </button>
        </form>

        <p class="text-center text-detail text-sm mt-8 font-medium">
          Sudah punya akun?
          <router-link to="/login" class="text-blueHeadline font-bold hover:text-bluePrimary hover:underline ml-1 transition-colors">
            Masuk Sekarang
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "../services/api"

// FORM STATE
const form = ref({
  username: "",
  fullname: "",
  email: "",
  bio: "",
  contact: "",
  password: "",
  password_confirmation: "",
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref("")
const router = useRouter()

// REGISTER LOGIC
async function handleRegister() {
  isLoading.value = true
  errorMessage.value = ""

  try {
    const res = await api.post("/register", form.value)

    if (!res.error) {
      router.push("/login")
    }

  } catch (err) {
    errorMessage.value = err.response?.data?.message 
      || "Register gagal."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full pl-4 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl text-sm 
         font-semibold text-headline placeholder-detail focus:outline-none focus:ring-2 
         focus:ring-blueHeadline focus:bg-base transition-all duration-300;
}

.password-toggle {
  @apply absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold 
         text-detail hover:text-blueHeadline uppercase cursor-pointer;
}

.submit-btn {
  @apply w-full py-4 rounded-xl bg-blueHeadline text-base font-bold text-lg tracking-wide 
         text-white hover:bg-bluePrimary hover:shadow-lg hover:shadow-blueHeadline/40 
         hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] 
         disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2;
}

@keyframes fadein {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fadein {
  animation: fadein 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.3; }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}
</style>
