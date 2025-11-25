<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-40 flex"
      aria-modal="true"
      role="dialog"
    >
      <!-- Backdrop, klik untuk menutup -->
      <div class="fixed inset-0 bg-black/40" @click="close"></div>

      <!-- Panel Sidebar Utama -->
      <aside
        class="ml-auto w-[360px] bg-white shadow-2xl h-full flex flex-col relative"
        @click.stop
      >
        <div class="h-16 flex items-center px-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-[#000000]">
            Mulai Chat Baru
          </h3>

          <button
            class="ml-auto p-2 rounded-full hover:bg-[#E9E9E9] transition"
            @click="close"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-6 h-6 text-[#14BEF0]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Input Pencarian User -->
        <div class="p-4">
          <label class="block text-sm mb-2 text-[#929292]">
            Cari user
          </label>
          <div class="flex gap-2">
            <input
              v-model="q"
              @input="onSearchInput"
              @keydown.enter.prevent="doSearch"
              placeholder="Cari berdasarkan username / nama"
              class="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 ring-[#14BEF0] transition-colors"
              :disabled="loading"
            />

            <button
              class="px-3 py-2 rounded-xl text-white transition bg-[#2AA8FF] hover:bg-[#14BEF0] disabled:opacity-50"
              @click="doSearch"
              :disabled="loading || q.length < 1"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>Cari</span>
            </button>
          </div>
        </div>

        <!-- Hasil Pencarian -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-if="loading" class="p-4">
            <!-- Skeleton Loader -->
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="q.length > 0 && users.length === 0"
            class="p-4 text-center text-[#929292]"
          >
            Tidak ada user ditemukan.
          </div>
          
          <div
            v-else-if="q.length === 0"
            class="p-4 text-center text-[#929292]"
          >
            Masukkan username atau nama untuk mencari.
          </div>

          <ul v-else class="divide-y divide-gray-100">
            <li
              v-for="user in users"
              :key="user.id"
              class="p-3 hover:bg-[#E9E9E9] flex items-center gap-3 cursor-pointer transition"
              @click="selectUser(user)"
            >
              
              <!-- KOMPONEN INISIAL BARU PENGGANTI <img> -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-[#14BEF0] flex-shrink-0"
              >
                {{ getUserInitials(user.fullname) }}
              </div>
              <!-- AKHIR KOMPONEN INISIAL -->

              <div class="flex-1">
                <div class="text-sm font-medium text-[#000000]">
                  {{ user.fullname || user.username }}
                </div>
                <div class="text-xs text-[#929292]">
                  @{{ user.username }}
                </div>
              </div>

              <div class="text-sm font-medium text-[#14BEF0]">
                Chat
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer / Error Display (DIPERBAIKI) -->
        <div class="p-3 border-t border-gray-200 text-sm">
          <div v-if="error" class="text-red-600 font-medium">
            {{ error }}
          </div>
          <div v-else class="text-xs text-[#929292]">
            Klik user untuk membuat chat baru. Jika chat sudah ada, otomatis membuka chat tersebut.
          </div>
        </div>
      </aside>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from '@/services/api';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat/useChatStore';

const props = defineProps({
  // Gunakan v-model untuk mengontrol visibilitas dari parent
  modelValue: { type: Boolean, default: false }, 
});

const emit = defineEmits(['update:modelValue', 'created']);

const visible = ref(props.modelValue);
const q = ref('');
const users = ref([]);
const loading = ref(false);
const error = ref(null);

const router = useRouter();
const chatStore = useChatStore();

// ==========================================================
// FUNGSI BARU: MENGAMBIL INISIAL DARI FULLNAME
// ==========================================================

/**
 * Mengambil inisial dari nama lengkap.
 * Contoh: "Budi Santoso" -> "BS"
 * Contoh: "Susi" -> "S"
 * @param {string} fullname 
 * @returns {string} Inisial (maksimal 2 huruf)
 */
function getUserInitials(fullname) {
  if (!fullname) {
    return 'U'; // Default inisial jika nama kosong
  }
  
  // Pisahkan nama berdasarkan spasi
  const parts = fullname.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // Jika hanya satu kata, ambil huruf pertamanya
    return parts[0].charAt(0).toUpperCase();
  }
  
  // Jika lebih dari satu kata, ambil huruf pertama dari kata pertama dan kata terakhir
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
}

// ==========================================================
// FUNGSI LAMA
// ==========================================================

// Sinkronisasi visible dengan modelValue prop
watch(
  () => props.modelValue,
  (v) => {
    visible.value = v;
    if (v) {
      // Reset state saat panel dibuka
      q.value = '';
      users.value = [];
      error.value = null;
    }
  }
);

function close() {
  visible.value = false;
  // Memancarkan event untuk mengubah v-model di parent
  emit('update:modelValue', false); 
}

let searchTimer = null;
function onSearchInput() {
  clearTimeout(searchTimer);
  
  if (q.value.trim().length === 0) {
      users.value = [];
      error.value = null;
      return;
  }
  
  searchTimer = setTimeout(() => {
    doSearch();
  }, 400);
}

async function doSearch() {
  if (!q.value.trim()) {
    users.value = [];
    return;
  }
  
  loading.value = true;
  error.value = null;
  users.value = [];

  try {
    // Memanggil endpoint pencarian user, yang idealnya adalah /users?q=...
    const res = await axios.get('/users', { params: { q: q.value } });
    
    // Pastikan hasil adalah array
    users.value = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);

    // Jika search berhasil tapi hasilnya 0, error tetap null.
  } catch (err) {
    console.error('user search error:', err);
    // Jika ada respons, tampilkan pesan dari server (jika ada)
    if (err.response && err.response.data && err.response.data.message) {
        error.value = `Gagal mencari user: ${err.response.data.message}`;
    } else {
        // Pesan error umum jika gagal koneksi/server tidak merespon 
        // Mengganti pesan error agar lebih informatif
        error.value = 'Terjadi kesalahan koneksi atau server tidak merespon. Cek tab Network browser Anda.';
    }
  } finally {
    loading.value = false;
  }
}

async function selectUser(user) {
  try {
    const payload = { username: user.username }; // Menggunakan username untuk createChat
    // Mencoba membuat/membuka chat
    const chat = await chatStore.createChat(payload); 

    // Memberi tahu parent bahwa chat telah dibuat/dibuka
    emit('created', chat); 

    // Tutup panel
    close();

    // Arahkan ke chat baru (atau chat yang sudah ada)
    router.push({ name: 'chat.detail', params: { id: chat.id } });
  } catch (err) {
    console.error('createChat failed', err);
    error.value = err?.response?.data?.message || 'Gagal membuat chat';
  }
}
</script>

<style scoped>
/* Transisi ini akan membuat panel bergeser dari samping */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 250ms ease-in-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Custom Scrollbar for Results */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* gray-300 */
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6; /* gray-100 */
}
</style>