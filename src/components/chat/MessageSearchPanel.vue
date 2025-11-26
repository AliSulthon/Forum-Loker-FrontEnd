<template>
  <div
    class="fixed inset-0 z-40 flex"
    aria-modal="true"
    role="dialog"
  >
    <div 
      class="fixed inset-0 bg-black/40 transition-opacity" 
      @click="$emit('close')"
    ></div>

    <aside
      class="ml-auto w-80 md:w-[360px] h-full bg-white shadow-2xl flex flex-col relative transform transition-transform"
      @click.stop
    >
      <div class="h-16 flex items-center px-4 border-b border-gray-200 shrink-0">
        <h2 class="text-lg font-semibold text-[#000000]"> 
          Cari Pesan
        </h2>
        
        <button
          @click="$emit('close')"
          class="ml-auto p-2 rounded-full hover:bg-[#E9E9E9] transition text-[#929292] hover:text-[#14BEF0]"
          aria-label="Tutup Pencarian"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-6 h-6" 
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

      <div class="p-4 shrink-0">
        <input
          v-model="query"
          @input="handleInput"
          @keyup.enter.prevent="searchNow"
          type="text"
          placeholder="Masukkan kata kunci..."
          aria-label="Kolom Pencarian Pesan"
          class="w-full px-4 py-2 rounded-xl bg-gray-100 text-[#000000] placeholder-[#929292] focus:outline-none focus:ring-2 focus:ring-[#14BEF0] border border-transparent focus:bg-white transition-all"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="text-[#14BEF0] text-center mt-6 text-sm animate-pulse flex flex-col items-center">
          <svg class="animate-spin h-5 w-5 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sedang mencari...
        </div>

        <div
          v-else-if="results && results.length === 0 && (query || '').trim().length > 0"
          class="text-[#929292] text-center mt-6 px-4 text-sm"
        >
          Tidak ada pesan yang ditemukan untuk "{{ query }}".
        </div>

        <ul v-else-if="results && results.length > 0" class="divide-y divide-gray-100">
          <li
            v-for="msg in results"
            :key="msg.id"
            class="px-4 py-3 hover:bg-[#E9E9E9] cursor-pointer transition group"
            @click="jumpTo(msg.id)"
          >
            <div class="flex flex-col">
              <p class="text-[#000000] text-sm group-hover:text-[#14BEF0] transition-colors line-clamp-2 font-medium">
                {{ msg.text }}
              </p>
              <p class="text-[#929292] text-xs mt-1"> 
                {{ formatDate(msg.created_at) }}
              </p>
            </div>
          </li>
        </ul>

        <div v-else class="text-[#929292] text-center mt-10 p-4 text-sm flex flex-col items-center">
            <i class="fa-solid fa-magnifying-glass text-2xl mb-2 opacity-30 text-[#929292]"></i>
            Masukkan kata kunci untuk mencari.
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
// ... (script setup tidak ada perubahan)
import { ref } from "vue";
import { useMessageStore } from "@/stores/chat/useMessageStore";

// --- Props & Emits ---
const props = defineProps({
  chatId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "jump"]);

// --- State Management ---
const query = ref("");
const loading = ref(false);
const results = ref([]);
const messageStore = useMessageStore();

let searchTimeout = null;
const DEBOUNCE_DELAY = 500; 

// --- Helper Functions ---
const formatDate = (timestamp) => {
  if (!timestamp) return "Tidak diketahui";
  const date = new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const jumpTo = (messageId) => {
  emit("jump", messageId);
};

// --- Core Search Logic ---
const performSearch = async () => {
  const q = query.value.trim();
  if (!q) {
    results.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const apiResults = await messageStore.searchMessages(props.chatId, q);
    // console.log("Search Results:", apiResults);
    results.value = Array.isArray(apiResults) ? apiResults : [];
  } catch (e) {
    console.error("Search error:", e);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

// --- Event Handlers ---
const handleInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!query.value.trim()) {
    results.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  searchTimeout = setTimeout(performSearch, DEBOUNCE_DELAY);
};

const searchNow = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  performSearch();
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  /* Menggunakan warna netral/outline (misalnya Biru Muda 1) */
  background-color: #97DFF4; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>