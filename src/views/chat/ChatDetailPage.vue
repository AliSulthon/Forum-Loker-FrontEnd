<template>
  <div class="flex flex-col h-full w-full relative">

    <ChatDetailHeader
      v-if="activeChat"
      :chat="activeChat"
      :key="chatId"
      @searchMessages="isSearchOpen = true"
    />
    
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto bg-white" 
    >
      <MessageList
        :messages="messages"
        :loading="loadingMessages"
        :currentUserId="currentUserId"
        @open-edit-menu="openMessageOptions"
      />
    </div>

    <MessageInput
      v-if="!isEditing"
      :onSend="handleSendMessage"
      :disabled="!activeChat"
    />

    <MessageEditInput
        v-if="isEditing && messageToEdit"
        :message="messageToEdit"
        @cancel="cancelEditMessage"
        @confirm="confirmEditMessage"
    />

    <Teleport to="body">
      <div
          v-if="menuPosition.show && messageToEdit"
          @click.self="closeMenu"
          class="fixed inset-0 z-40" 
      >
          <div
              class="absolute bg-white rounded-lg shadow-xl py-1 text-sm z-50 border border-gray-100"
              :style="{ 
                top: `${menuPosition.y}px`, 
                left: `${menuPosition.x}px`,
                transform: 'translateY(-100%)' 
              }"
          >
              <ul class="min-w-[180px]">
                  <li 
                      v-if="String(messageToEdit.user_id) === String(currentUserId) && messageToEdit.type !== 'deleted'"
                      @click="() => { isEditing = true; closeMenu(); }"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                      <i class="fa-solid fa-pen mr-2 w-4"></i> Edit Pesan
                  </li>
                  
                  <li v-if="String(messageToEdit.user_id) === String(currentUserId) && messageToEdit.type !== 'deleted'"
                      @click="handleDeleteMessage('all')"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  >
                      <i class="fa-solid fa-trash-can mr-2 w-4"></i> Hapus untuk Semua
                  </li>
                  
                  <li @click="handleDeleteMessage('me')"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                      <i class="fa-solid fa-eye-slash mr-2 w-4"></i> Hapus untuk Saya
                  </li>
              </ul>
          </div>
      </div>
    </Teleport>
    
    <Teleport to="body">
        <MessageSearchPanel 
            v-if="isSearchOpen && activeChat"
            :chat-id="activeChat.id"
            @close="isSearchOpen = false"
            @jump="scrollToMessage"
        />
    </Teleport>
    
    <Teleport to="body">
        <NewChatPanel
            v-if="isNewChatOpen"
            @close="isNewChatOpen = false"
            @chat-created="handleNewChatCreated"
        />
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth"; 
import { useChatStore } from "@/stores/chat/useChatStore";
import { useMessageStore } from "@/stores/chat/useMessageStore";

import ChatDetailHeader from "@/components/chat/ChatDetailHeader.vue";
import MessageList from "@/components/chat/MessageList.vue";
import MessageInput from "@/components/chat/MessageInput.vue";
import MessageSearchPanel from "@/components/chat/MessageSearchPanel.vue"; 
import NewChatPanel from "@/components/chat/NewChatPanel.vue"; 
import MessageEditInput from "@/components/chat/MessageEditInput.vue"; 

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); 
const chatStore = useChatStore();
const messageStore = useMessageStore();

const chatId = computed(() => Number(route.params.id));
const activeChat = computed(() => chatStore.activeChat);
const messages = computed(() => messageStore.messages);
const loadingMessages = computed(() => messageStore.loading);
const currentUserId = computed(() => authStore.user?.id); 

const isSearchOpen = ref(false);
const isNewChatOpen = ref(false);
const messageListRef = ref(null);

const messageToEdit = ref(null);
const isEditing = ref(false); 
const menuPosition = ref({ x: 0, y: 0, show: false });

let pollingInterval = null;

// --- SCROLL UTILITIES ---
const scrollToBottom = async () => {
    await nextTick(); 
    if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
};

const scrollToMessage = async (messageId) => {
    isSearchOpen.value = false;
    await nextTick();
    const target = document.getElementById(`msg-${messageId}`); 
    if (target && messageListRef.value) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        messageListRef.value.scrollTop = 0;
    }
};

// --- LOGIKA FETCH DATA & POLLING ---
const fetchInitialData = async (idToFetch) => {
    try {
        await chatStore.fetchChatById(idToFetch); 
        await messageStore.fetchMessages(idToFetch);
    } catch (error) {
        if (Number(route.params.id) === idToFetch) {
            messageStore.$reset(); 
            chatStore.resetActiveChat(); 
            router.replace({ name: 'chat.empty' });
        }
        console.error("Gagal memuat detail chat/Akses ditolak:", error); 
    }
};

const startPolling = (id) => {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(async () => {
        if (Number(route.params.id) !== id) {
            clearInterval(pollingInterval);
            return;
        }
        try {
            await messageStore.fetchMessages(id);
        } catch (err) {
            console.error("Polling error:", err);
        }
    }, 4000); 
};

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
};

// --- WATCHER ROUTE PARAMS ---
watch(
    () => route.params.id,
    async (newId) => {
        stopPolling();
        messageStore.$reset(); 
        chatStore.resetActiveChat(); 
        isSearchOpen.value = false;
        isNewChatOpen.value = false;
        
        isEditing.value = false;
        messageToEdit.value = null;
        menuPosition.value = { x: 0, y: 0, show: false };
        
        if (newId) {
            const idToFetch = Number(newId);
            await fetchInitialData(idToFetch); 
            
            if (Number(route.params.id) === idToFetch) {
                startPolling(idToFetch);
            }
        }
    },
    { immediate: true }
);

// --- WATCHER PESAN BARU ---
watch(
    () => messageStore.messages, 
    (newMessages, oldMessages) => {
        if (newMessages.length !== oldMessages.length || oldMessages.length === 0) {
            scrollToBottom();
        }
    },
    { deep: true }
);

// --- LOGIKA KIRIM PESAN, NEW CHAT & EDIT/HAPUS ---

const handleSendMessage = async (text) => {
    if (!text || !activeChat.value) return;
    await messageStore.sendMessage(chatId.value, text); 
};

const handleNewChatCreated = (newChat) => {
    isNewChatOpen.value = false;
    router.push({ name: 'chat.detail', params: { id: newChat.id } });
};

// 🎯 FUNGSI MENU OPSI - STYLE WHATSAPP (LEBIH DEKAT KE BUBBLE)
const openMessageOptions = (message) => {
    const targetElement = document.getElementById(`msg-${message.id}`);
    if (targetElement && messageListRef.value) {
        const rect = targetElement.getBoundingClientRect();
        const menuWidth = 200;
        const menuHeight = 120;
        const gap = -100 ; // Jarak menu dari bubble (lebih dekat)
        
        // Posisi X: aligned dengan bubble pesan, tapi tidak terlalu ke tepi
        let xPos;
        
        // Jika pesan dari user sendiri (bubble di kanan)
        if (String(message.user_id) === String(currentUserId.value)) {
            // Menu align kanan dengan bubble, tapi agak masuk sedikit
            xPos = rect.right - menuWidth;
        } else {
            // Pesan dari orang lain (bubble di kiri)
            xPos = rect.left;
        }
        
        // Posisi Y: prioritas di ATAS bubble dengan jarak lebih dekat
        let yPos = rect.top - menuHeight - gap;
        
        // Jika menu keluar dari atas layar, taruh di bawah
        if (yPos < 70) { // Space untuk header
            yPos = rect.bottom + gap;
        }
        
        // Boundary check horizontal (jangan keluar layar)
        if (xPos < 10) {
            xPos = 10;
        } else if (xPos + menuWidth > window.innerWidth - 10) {
            xPos = window.innerWidth - menuWidth - 10;
        }
        
        menuPosition.value = {
            x: xPos,
            y: yPos,
            show: true
        };
        messageToEdit.value = message;
    }
};

const closeMenu = () => {
    menuPosition.value = { x: 0, y: 0, show: false };
};

// 🎯 FUNGSI EDIT
const cancelEditMessage = () => {
    isEditing.value = false;
    messageToEdit.value = null; 
};

const confirmEditMessage = async (newText) => {
    if (!messageToEdit.value || !newText) return;

    try {
        await messageStore.updateMessage(messageToEdit.value.chat_id, messageToEdit.value.id, newText);
    } catch (error) {
        console.error("Gagal mengedit pesan:", error);
    } finally {
        isEditing.value = false;
        messageToEdit.value = null; 
    }
};

// 🎯 FUNGSI HAPUS
const handleDeleteMessage = async (scope) => {
    if (!messageToEdit.value) return;

    const messageId = messageToEdit.value.id;
    const currentChatId = messageToEdit.value.chat_id;
    
    try {
        await messageStore.deleteMessage(currentChatId, messageId, scope);
    } catch (error) {
        console.error("Gagal menghapus pesan:", error);
    } finally {
        closeMenu();
        messageToEdit.value = null; 
    }
};

// --- LIFECYCLE HOOKS ---

onMounted(() => {
    scrollToBottom(); 
});

onBeforeUnmount(() => {
    stopPolling();
    chatStore.resetActiveChat(); 
    messageStore.$reset();
});

defineExpose({
    openNewChatPanel: () => {
        isNewChatOpen.value = true;
    }
});
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.25s ease-in-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>