<template>
  <div class="flex flex-col bg-[#F5F5F5] h-screen w-full overflow-hidden">
    <Navbar />
    <div class="flex flex-1 h-full overflow-hidden">

      <ChatSidebar
        :chats="chats"
        :active-id="activeId"
        @select="selectChat"
        @created="goToChat"
        @delete="handleDeleteChat"
      />

      <main class="flex-1 h-full overflow-y-auto relative custom-scrollbar">
        <router-view :key="$route.params.id" />
      </main>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useChatStore } from "@/stores/chat/useChatStore";
import { useAuthStore } from "@/stores/auth.js";

import ChatSidebar from "@/components/chat/ChatSidebar.vue";
import Navbar from '@/components/Navbar.vue';
const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
useAuthStore(); // Tetap dipanggil meskipun tidak dipakai di template

// STATE
const chats = computed(() => chatStore.chats);
const activeId = computed(() => Number(route.params.id) || null);
let pollingInterval = null;

// PILIH CHAT
const selectChat = (chat) => {
  router.push({
    name: "chat.detail",
    params: { id: chat.id },
  });
};

// SELESAI MEMBUAT CHAT BARU
const goToChat = (chat) => {
  router.push({
    name: "chat.detail",
    params: { id: chat.id },
  });
};

// HAPUS CHAT
const handleDeleteChat = async (chatId) => {
  try {
    if (!confirm("Yakin ingin menghapus chat ini?")) return;

    await chatStore.deleteChat(chatId);

    if (String(activeId.value) === String(chatId)) {
      router.replace({ name: "chat.empty" });
    }
  } catch (error) {
    alert("Gagal menghapus chat.");
    console.error("Error deleting chat in layout:", error);
  }
};

// POLLING
onMounted(async () => {
  await chatStore.fetchChats();

  pollingInterval = setInterval(async () => {
    try {
      await chatStore.fetchChats();
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, 5000);
});

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
