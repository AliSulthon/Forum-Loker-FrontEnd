<template>
  <aside class="w-[340px] h-full border-r border-gray-200 bg-white flex flex-col shrink-0">
    
    <div class="h-16 flex items-center px-4 border-b border-gray-200 bg-white gap-2 shrink-0">
      <div class="flex-1">
        <ChatSearch @search="handleSearch" />
      </div>
      <button
        class="p-2 rounded-full transition hover:bg-[#E9E9E9] flex-shrink-0"
        @click="openNewChat"
        title="Chat Baru"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#14BEF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative">
      
      <div v-if="loadingSearch" class="p-4 text-[#14BEF0] text-center text-sm animate-pulse">
        Sedang mencari kontak...
      </div>

      <div v-else-if="sortedDisplayedChats.length === 0" class="p-4 text-[#929292] text-center text-sm">
        {{ currentQuery ? 'Kontak tidak ditemukan' : 'Belum ada chat' }}
      </div>

      <ChatItem
        v-for="chat in sortedDisplayedChats"
        :key="chat.id"
        :chat="chat" 
        :active="chat.id == activeId"
        @click="selectChat(chat)"
        @open-menu="openChatMenu(chat)" 
      />
    </div>

    <NewChatPanel 
      v-model="panelOpen" 
      @created="onCreated"
    />
    
    <!-- ✅ PERBAIKAN: Hapus prop currentParticipant karena tidak diperlukan -->
    <ChatActionsOverlay 
      :isOpen="menuOpen"
      :chat="selectedChatForMenu"
      @update:isOpen="menuOpen = $event"
      @action-complete="handleActionComplete"
    />

  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat/useChatStore' 
import { useAuthStore } from '@/stores/auth'

import ChatSearch from '@/components/chat/ChatSearch.vue'
import ChatItem from '@/components/chat/ChatItem.vue'
import NewChatPanel from '@/components/chat/NewChatPanel.vue' 
import ChatActionsOverlay from '@/components/chat/ChatActionsOverlay.vue'

const props = defineProps({
  chats: { 
    type: Array,
    default: () => []
  },
  activeId: Number
})

const emit = defineEmits(['select', 'search']) 

const chatStore = useChatStore()
const authStore = useAuthStore()

// --- STATE ---
const panelOpen = ref(false) 
const searchResults = ref(null) 
const currentQuery = ref('')    
const loadingSearch = ref(false) 

// 🎯 STATE MENU OVERLAY
const menuOpen = ref(false)
const selectedChatForMenu = ref({})

// Get current user ID
const currentUserId = computed(() => authStore.user?.id)

// --- COMPUTED ---
const displayedChats = computed(() => {
  if (Array.isArray(searchResults.value)) {
    return searchResults.value
  }
  return Array.isArray(props.chats) ? props.chats : []
})

// 🎯 SORTING: Pin di atas, lalu waktu terbaru (tetap pakai id)
const sortedDisplayedChats = computed(() => {
  const chatsToSort = displayedChats.value || []
  
  if (!Array.isArray(chatsToSort) || chatsToSort.length === 0) {
    return []
  }
  
  return [...chatsToSort].sort((a, b) => {
    if (!a.participants || !b.participants) {
      return 0
    }

    // ✅ PERBAIKAN: Tetap menggunakan id bukan user_id
    const aParticipant = a.participants.find(p => 
      String(p.id) === String(currentUserId.value)
    )
    const bParticipant = b.participants.find(p => 
      String(p.id) === String(currentUserId.value)
    )
    
    const aPinned = aParticipant?.pinned || false
    const bPinned = bParticipant?.pinned || false

    // Prioritas 1: Status Pin (pinned di atas)
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1

    // Prioritas 2: Waktu terbaru (newest first)
    const aTime = new Date(a.last_message?.created_at || a.updated_at || 0).getTime()
    const bTime = new Date(b.last_message?.created_at || b.updated_at || 0).getTime()
    
    return bTime - aTime
  })
})

// --- LOGIC UTAMA SEARCH ---
const handleSearch = async (query) => {
  const safeQuery = query ? query.trim() : ''
  currentQuery.value = safeQuery
  
  if (safeQuery === '') {
    searchResults.value = null 
    loadingSearch.value = false
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

// 🎯 LOGIC MENU OVERLAY (Simplified)
function openChatMenu(chat) {
    selectedChatForMenu.value = chat
    menuOpen.value = true
}

function handleActionComplete(message) {
    console.log("Aksi Selesai:", message) 
}
</script>

<style scoped>
/* Scrollbar Style */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>