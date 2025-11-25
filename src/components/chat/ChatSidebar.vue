<template>
  <div class="w-[340px] h-full border-r border-gray-200 bg-white flex flex-col">
    
    <!-- Header: HANYA Search Bar (Logo dihapus) -->
    <div class="h-16 flex items-center px-4 border-b border-gray-200 bg-white gap-2">
      
      <!-- Search Bar (Flex-1) -->
      <div class="flex-1">
        <ChatSearch
          @search="handleSearch"
        />
      </div>

      <!-- Button New Chat -->
      <button
        class="p-2 rounded-full transition hover:bg-[#E9E9E9] flex-shrink-0"
        @click="openNewChat"
        title="Chat Baru"
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
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      </button>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      
      <div v-if="loadingSearch" class="p-4 text-[#14BEF0] text-center text-sm animate-pulse">
        Sedang mencari kontak...
      </div>

      <div v-else-if="displayedChats.length === 0" class="p-4 text-[#929292] text-center text-sm">
        {{ currentQuery ? 'Kontak tidak ditemukan' : 'Belum ada chat' }}
      </div>

      <ChatItem
        v-for="chat in displayedChats"
        :key="chat.id"
        :chat="chat" 
        :active="chat.id == activeId"
        @click="selectChat(chat)"
        @open-menu="openChatMenu(chat)" />
    </div>

    <NewChatPanel 
      v-model="panelOpen" 
      @created="onCreated"
    />
    
    <ChatActionsOverlay 
      :isOpen="menuOpen"
      :chat="selectedChatForMenu"
      :currentParticipant="currentParticipantForMenu"
      @update:isOpen="menuOpen = $event"
      @action-complete="handleActionComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat/useChatStore' 

import ChatSearch from '@/components/chat/ChatSearch.vue'
import ChatItem from '@/components/chat/ChatItem.vue'
import NewChatPanel from '@/components/chat/NewChatPanel.vue' 
import ChatActionsOverlay from '@/components/chat/ChatActionsOverlay.vue'; 

const props = defineProps({
  chats: { 
    type: Array,
    default: () => []
  },
  activeId: Number
})

const emit = defineEmits(['select', 'search']) 

const chatStore = useChatStore()

// --- STATE ---
const panelOpen = ref(false) 
const searchResults = ref(null) 
const currentQuery = ref('')    
const loadingSearch = ref(false) 

// 🎯 STATE MENU OVERLAY
const menuOpen = ref(false)
const selectedChatForMenu = ref({})
const currentParticipantForMenu = ref(null)


// --- COMPUTED ---
const displayedChats = computed(() => {
  if (Array.isArray(searchResults.value)) {
    return searchResults.value
  }
  return props.chats
})

// --- LOGIC UTAMA SEARCH ---
const handleSearch = async (query) => {
  const safeQuery = query ? query.trim() : ''
  currentQuery.value = safeQuery
  
  if (safeQuery === '') {
    searchResults.value = null 
    loadingSearch.value = false;
    await chatStore.fetchChats(); 
    return
  }

  loadingSearch.value = true
  
  try {
    const results = await chatStore.searchChats(safeQuery)
    searchResults.value = results
  } catch (error) {
    console.error("Gagal mencari:", error)
    searchResults.value = [] 
  } finally {
    loadingSearch.value = false
  }
}

// --- HANDLER LAIN ---
function openNewChat() {
  panelOpen.value = true 
}

function onCreated(chat) {
  selectChat(chat) 
}

/**
 * Menangani klik pada item chat.
 */
async function selectChat(chat) {
  emit('select', chat)

  if (chat.unread_count && chat.unread_count > 0) {
    try {
      await chatStore.markAsRead(chat.id) 
    } catch (error) {
      console.error("Gagal menandai chat sebagai dibaca:", error)
    }
  }
}


// 🎯 LOGIC MENU OVERLAY
function openChatMenu(chat) {
    // 1. Set data chat yang akan dioper ke overlay
    selectedChatForMenu.value = chat;
    
    // 2. Cari data partisipan yang relevan (Anda sendiri)
    const currentUserId = chatStore.currentUserId; // Ambil dari Pinia Getter
    currentParticipantForMenu.value = chat.participants.find(p => 
        String(p.user_id) === String(currentUserId)
    );
    
    // 3. Buka overlay
    menuOpen.value = true;
}

function handleActionComplete(message) {
    // Logika untuk menampilkan notifikasi/toast setelah aksi (Pin/Mute/Delete) selesai
    console.log("Aksi Selesai:", message); 
    // Anda mungkin ingin menambahkan toast/snackbar di sini.
}

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6; 
}

.font-namaApp {
    font-family: Inter, sans-serif; 
}
</style>