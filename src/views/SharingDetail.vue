<template>
  <div class="min-h-screen bg-gray-50 font-sans relative pb-20">

    <div class="fixed inset-0 z-0 opacity-40 pointer-events-none" 
      style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <button 
        @click="$router.push('/sharing')" 
        class="mb-6 flex items-center gap-2 text-detail font-bold hover:text-blueHeadline transition-colors group"
      >
        <div class="p-2 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-blueHeadline transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </div>
        <span>Kembali ke Feed</span>
      </button>

      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div class="lg:col-span-2 space-y-4">
          <div class="h-64 bg-white rounded-2xl"></div>
          <div class="h-32 bg-white rounded-2xl"></div>
        </div>
        <div class="h-64 bg-white rounded-2xl"></div>
      </div>

      <div v-else-if="error" class="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-headline">Postingan Tidak Ditemukan</h2>
        <button @click="$router.push('/sharing')" class="mt-4 text-blueHeadline font-bold">Kembali</button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden relative">
            
            <div class="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blueHeadline to-bluePrimary text-white flex items-center justify-center font-bold text-2xl shadow-md">
                   {{ getInitials(sharing.user?.fullname) }}
                </div>
                <div>
                  <h3 class="font-bold text-headline text-lg leading-tight">
                    {{ sharing.user?.fullname }}
                  </h3>
                  <div class="flex items-center gap-2 text-sm text-detail">
                    <span>@{{ sharing.user?.username || 'user' }}</span>
                    <span>•</span>
                    <span>{{ formatDate(sharing.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-8">
              <h1 class="font-namaApp text-3xl font-bold text-headline mb-6 leading-tight">
                {{ sharing.title }}
              </h1>
              <div class="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-[16px]">
                {{ sharing.content }}
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              
              <div class="flex gap-4">
                <button 
                  @click="toggleLike"
                  :disabled="isLikeProcessing"
                  :class="[
                    'flex items-center gap-2 font-bold text-sm transition-all duration-300 transform',
                    isLiked ? 'text-red-500 active:scale-95' : 'text-detail hover:text-red-400 active:scale-95',
                    { 'opacity-70 cursor-not-allowed': isLikeProcessing }
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    :fill="isLiked ? 'currentColor' : 'none'" 
                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  
                  <span>{{ likeCount }} Suka</span>
                </button>
              </div>
              
              <button @click="copyLink" class="flex items-center gap-2 text-detail hover:text-headline transition-colors font-semibold text-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share
              </button>
            </div>
          </div>

        </div>

        <div class="lg:col-span-1 space-y-6 sticky top-24">
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
             <h4 class="text-xs font-bold text-detail uppercase tracking-widest mb-4">Tentang Penulis</h4>
             <div class="flex flex-col items-center text-center">
               <div class="w-20 h-20 rounded-full bg-gray-100 mb-3 flex items-center justify-center text-3xl font-namaApp text-gray-400">
                  {{ getInitials(sharing.user?.fullname) }}
               </div>
               <h3 class="font-bold text-headline text-lg">{{ sharing.user?.fullname }}</h3>
               <p class="text-sm text-detail mt-1 mb-4">Member of Sevanta Community</p>
             </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sharing = ref({})
const isLoading = ref(true)
const error = ref(false)

// State khusus untuk Like
const isLiked = ref(false)
const likeCount = ref(0)

// --- Fetch Data dengan Performance Monitoring ---
async function fetchDetail() {
  const startTime = performance.now()
  isLoading.value = true
  
  const id = route.params.id
  authStore.loadFromStorage()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await api.get(
      `/sharing/${id}`,
      { signal: controller.signal }
    )
    
    clearTimeout(timeoutId)
    
    sharing.value = response.data.data
    
    // Pastikan data like diambil dari response detail
    likeCount.value = response.data.data.likes_count || 0
    isLiked.value = response.data.data.is_liked || false
    
    // ✅ DEBUG: Cek apakah backend return is_liked
    console.log('=== LIKE STATUS DEBUG ===')
    console.log('Backend Response:', response.data.data)
    console.log('likes_count:', likeCount.value)
    console.log('is_liked:', isLiked.value)
    console.log('is_liked type:', typeof isLiked.value)
    console.log('========================')
    
    const endTime = performance.now()
    console.log(`⏱️ Fetch detail: ${(endTime - startTime).toFixed(2)}ms`)
    
  } catch (err) {
    clearTimeout(timeoutId)
    console.error('❌ Error fetching detail:', err)
    
    if (err.response?.status === 401) {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      authStore.logout()
      router.push('/login')
      return
    }
    
    if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
      console.error('Request timeout - koneksi terlalu lambat')
      alert('Koneksi terlalu lambat. Silakan coba lagi.')
    } else if (err.response?.status === 404) {
      alert('Postingan tidak ditemukan.')
    } else {
      alert('Terjadi kesalahan saat memuat data.')
    }
    
    error.value = true
  } finally {
    isLoading.value = false
  }
}

// --- Toggle Like dengan Debounce & Optimistic UI ---
let likeDebounceTimer = null
const isLikeProcessing = ref(false)

async function toggleLike() {
  // ✅ CEK AUTH sebelum like
  if (!authStore.isAuthenticated) {
    alert('Silakan login untuk menyukai postingan!')
    router.push('/login')
    return
  }
  
  // Prevent spam/double click
  if (isLikeProcessing.value) return
  
  // Clear timer sebelumnya
  if (likeDebounceTimer) {
    clearTimeout(likeDebounceTimer)
  }

  // Simpan state lama untuk rollback
  const previousState = isLiked.value
  const previousCount = likeCount.value

  // Optimistic UI update
  if (isLiked.value) {
    likeCount.value--
    isLiked.value = false
  } else {
    likeCount.value++
    isLiked.value = true
  }

  // Debounce 300ms - cegah spam click
  likeDebounceTimer = setTimeout(async () => {
    isLikeProcessing.value = true
    
    const id = route.params.id

    try {
      // Pastikan response dideklarasikan menggunakan let/const di scope try
      const response = await api.post(
        `/sharing/${id}/like`,
        {},
        { timeout: 5000 }
      )
  
      // ✅ SYNC state dari backend response
      if (response.data && !response.data.error) {
        // ✅ PENTING: Update dari backend response yang sudah menggunakan toggle()
        isLiked.value = response.data.is_liked
        likeCount.value = response.data.likes_count
        
        console.log('=== LIKE RESPONSE DEBUG (SUCCESS) ===')
        console.log('Backend Response:', response.data)
        console.log('New is_liked:', isLiked.value)
        console.log('New likes_count:', likeCount.value)
        console.log('=====================================')
      }

    } catch (error) {
      console.error("❌ Gagal like:", error)
      
      // Rollback ke state semula jika API gagal
      isLiked.value = previousState
      likeCount.value = previousCount
      
      if (error.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.")
        authStore.logout()
        router.push('/login')
      } else if (error.code === 'ECONNABORTED') {
        alert("Koneksi timeout. Silakan coba lagi.")
      } else if (error.response?.status === 404) {
        alert("Postingan tidak ditemukan.")
      } else {
        // Menggunakan error.response?.data?.message untuk menangani error dari backend
        alert(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.")
      }
    } finally {
      isLikeProcessing.value = false
    }
  }, 300) // Debounce 300ms
}

// --- Helper Functions ---
function getInitials(name) {
  return name ? name.charAt(0).toUpperCase() : '?'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert("Link tersalin!")
  } catch (err) {
    console.error('Copy failed:', err)
    // Fallback manual copy
    const textarea = document.createElement('textarea')
    textarea.value = window.location.href
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert("Link tersalin!")
  }
}

onMounted(() => {
  console.log('=== SharingDetail Mounted ===')
  console.log('Auth Store User:', authStore.user?.fullname)
  console.log('Is Authenticated:', authStore.isAuthenticated)
  console.log('Sharing ID:', route.params.id)
  console.log('=============================')
  
  fetchDetail()
})
</script>