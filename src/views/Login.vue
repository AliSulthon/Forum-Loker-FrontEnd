<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative p-4 font-sans overflow-hidden">
    
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none" 
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blueLight rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blueHeadline rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>

    <div class="z-10 bg-base shadow-2xl rounded-[30px] flex flex-col md:flex-row w-full max-w-5xl overflow-hidden animate-fadein border border-white/50">

      <div class="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-blueHeadline to-bluePrimary p-10 lg:p-14 text-base flex-col justify-center relative overflow-hidden">
        
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-blueLight rounded-full mix-blend-overlay opacity-50 blur-2xl"></div>
        <div class="absolute -bottom-32 -left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay opacity-20 blur-3xl"></div>
        
        <div class="relative z-10">
          <img 
            src="/logo-forum-loker.png" 
            alt="Logo Forum Loker" 
            class="w-28 mb-8 drop-shadow-md hover:scale-105 transition-transform duration-300"
          >

          <h2 class="font-namaApp text-3xl font-bold mb-2 uppercase tracking-wide opacity-90">Welcome to</h2>
          <h1 class="font-namaApp text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-sm leading-tight">
            FORUM<br>LOKER
          </h1>
          <p class="text-blue-50 text-sm leading-relaxed font-medium opacity-90 max-w-xs">
            Temukan peluang karir terbaikmu dan bangun masa depan profesional bersama komunitas kami.
          </p>
        </div>
      </div>

      <div class="w-full md:w-[55%] bg-base p-8 lg:p-16 flex flex-col justify-center">
        
        <div class="text-center mb-6">
          
          <div class="flex justify-center md:hidden mb-6">
            <img src="/logo-forum-loker.png" alt="Logo Forum Loker" class="w-24 drop-shadow-sm">
          </div>

          <h2 class="text-3xl font-bold text-headline font-namaApp tracking-tight">Sign In</h2>
          <p class="text-detail text-sm mt-2 font-medium">
            Masuk untuk mengakses akun Anda
          </p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fadein">
            <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="text-sm text-red-600 font-medium">
              {{ errorMessage }}
            </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-detail group-focus-within:text-blueHeadline transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Email Address"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline placeholder-detail focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-base focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-detail group-focus-within:text-blueHeadline transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full pl-12 pr-16 py-4 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline placeholder-detail focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-base focus:border-transparent transition-all duration-300"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-detail hover:text-blueHeadline tracking-wider uppercase transition-colors cursor-pointer"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <div class="flex items-center justify-between text-sm">
             <label class="flex items-center text-detail cursor-pointer hover:text-headline transition-colors group">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blueHeadline focus:ring-blueHeadline accent-blueHeadline cursor-pointer">
                <span class="ml-2 font-medium group-hover:text-headline transition-colors">Ingat Saya</span>
             </label>
             <a href="#" class="text-blueHeadline font-bold hover:text-bluePrimary hover:underline transition-colors">Lupa Password?</a>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 rounded-xl bg-blueHeadline text-base font-bold text-lg tracking-wide text-white
                   hover:bg-bluePrimary hover:shadow-lg hover:shadow-blueHeadline/40 hover:-translate-y-0.5
                   transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            
            <span v-if="!isLoading">Masuk</span>
            <span v-else>Memproses...</span>
          </button>

        </form>

        <p class="text-center text-detail text-sm mt-8 font-medium">
          Belum punya akun?
          <router-link to="/register" class="text-blueHeadline font-bold hover:text-bluePrimary hover:underline ml-1 transition-colors">
            Daftar Sekarang
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { loginUser } from "@/services/auth.js"

// STATE
const email = ref("")
const password = ref("")
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref("")

const router = useRouter()

// HANDLE LOGIN
async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ""

  try {
    const res = await loginUser(email.value, password.value)

    if (!res.error) {
      localStorage.setItem("auth_token", res.data.access_token)
      localStorage.setItem("user_info", JSON.stringify(res.data.user))
      router.push("/")
    }

  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Login gagal."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

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
