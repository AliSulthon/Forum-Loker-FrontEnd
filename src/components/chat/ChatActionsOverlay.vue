<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20"
      @click.self="close"
    >
      <div 
        class="bg-white rounded-lg shadow-xl w-72 overflow-hidden transform transition-all duration-300"
        @click.stop
      >
        <div class="p-4 border-b">
          <h3 class="font-semibold text-lg">{{ chatTitle }}</h3>
          <p class="text-xs text-[#929292]">Opsi untuk chat ini</p>
        </div>

        <div class="py-2">
          
          <button 
            @click="togglePin" 
            :disabled="loading"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition"
          >
            <i :class="isPinned ? 'fa-solid fa-thumbtack text-red-500' : 'fa-solid fa-thumbtack'"></i>
            <span>{{ isPinned ? 'Unpin Chat' : 'Pin Chat' }}</span>
            <i v-if="loading && currentAction === 'pin'" class="fa-solid fa-spinner fa-spin ml-auto text-[#14BEF0]"></i>
          </button>
          
          <button 
            @click="handleMute" 
            :disabled="loading || isMuted"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition"
          >
            <i class="fa-solid fa-bell-slash"></i>
            <span>{{ isMuted ? 'Muted (1 Jam)' : 'Mute Chat (1 Jam)' }}</span>
            <i v-if="loading && currentAction === 'mute'" class="fa-solid fa-spinner fa-spin ml-auto text-[#14BEF0]"></i>
          </button>

          <hr class="my-2">
          
          <button 
            @click="handleDelete" 
            :disabled="loading"
            class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 transition"
          >
            <i class="fa-solid fa-trash"></i>
            <span>Hapus Chat (Hanya untuk Saya)</span>
            <i v-if="loading && currentAction === 'delete'" class="fa-solid fa-spinner fa-spin ml-auto"></i>
          </button>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat/useChatStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  chat: {
    type: Object,
    required: true
  },
  // Properti partisipan saat ini (sudah tersedia di objek chat)
  currentParticipant: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:isOpen', 'action-complete'])
const chatStore = useChatStore()

const loading = ref(false)
const currentAction = ref(null) // Untuk mengontrol loading state per tombol

const chatTitle = computed(() => {
    // Logika yang sama seperti di ChatItem (ambil nama chat atau nama lawan bicara)
    if (props.chat.name) return props.chat.name;
    const currentUserId = chatStore.currentUserId; // Asumsi getter sudah ada di store
    
    if (props.chat.participants && props.chat.participants.length > 0) {
      const otherParticipant = props.chat.participants.find(
        (p) => String(p.user_id) !== String(currentUserId)
      )?.user;
      
      return otherParticipant?.username || otherParticipant?.fullname || "Chat Privat";
    }
    return "Chat Opsi";
})

const isPinned = computed(() => props.currentParticipant?.pinned ?? false);
const isMuted = computed(() => {
    const muteUntil = props.currentParticipant?.mute_until;
    return muteUntil && new Date(muteUntil) > new Date();
});

function close() {
  emit('update:isOpen', false)
}

// --- HANDLER LOGIC ---

async function togglePin() {
    currentAction.value = 'pin';
    loading.value = true;
    try {
        const payload = { pinned: !isPinned.value };
        await chatStore.updateChatStatus(props.chat.id, payload);
        // Setelah update, Pinia Store akan mengurutkan ulang list.
        close();
        emit('action-complete', 'Pin berhasil diubah.');
    } catch (error) {
        console.error("Gagal Pin/Unpin:", error);
    } finally {
        loading.value = false;
        currentAction.value = null;
    }
}

async function handleMute() {
    currentAction.value = 'mute';
    loading.value = true;
    try {
        // Mute untuk 1 jam dari sekarang
        const muteUntil = new Date();
        muteUntil.setHours(muteUntil.getHours() + 1);
        
        const payload = { mute_until: muteUntil.toISOString() };
        await chatStore.updateChatStatus(props.chat.id, payload);
        
        close();
        emit('action-complete', 'Chat berhasil dimute selama 1 jam.');
    } catch (error) {
        console.error("Gagal Mute:", error);
    } finally {
        loading.value = false;
        currentAction.value = null;
    }
}

async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus chat '${chatTitle.value}' hanya untuk Anda?`)) {
        return;
    }

    currentAction.value = 'delete';
    loading.value = true;
    try {
        // Menggunakan scope 'me'
        await chatStore.deleteChat(props.chat.id, 'me'); 
        
        close();
        // Setelah delete, store akan mengurus reset activeChat.
        emit('action-complete', 'Chat berhasil dihapus.');

    } catch (error) {
        console.error("Gagal Hapus Chat:", error);
    } finally {
        loading.value = false;
        currentAction.value = null;
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>