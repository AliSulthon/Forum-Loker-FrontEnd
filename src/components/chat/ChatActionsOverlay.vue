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
          <h3 class="font-semibold text-black">{{ chatTitle }}</h3> 
          <p class="text-xs text-[#929292]">Opsi untuk chat ini</p>
        </div>

        <div class="py-2">
          
          <button 
            @click="togglePin" 
            :disabled="loading"
            class="w-full text-left px-4 py-2 hover:bg-[#E9E9E9] flex items-center gap-3 transition" 
          >
            <i :class="isPinned ? 'fa-solid fa-thumbtack text-[#2AA8FF]' : 'fa-solid fa-thumbtack text-[#929292]'"></i>
            <span :class="{'text-black': !isPinned, 'text-[#2AA8FF]': isPinned}">{{ isPinned ? 'Unpin Chat' : 'Pin Chat' }}</span>
            <i v-if="loading && currentAction === 'pin'" class="fa-solid fa-spinner fa-spin ml-auto text-[#14BEF0]"></i>
          </button>
          
          <button 
            @click="toggleMute" 
            :disabled="loading" 
            class="w-full text-left px-4 py-2 hover:bg-[#E9E9E9] flex items-center gap-3 transition"
          >
            <i :class="isMuted ? 'fa-solid fa-bell text-[#2AA8FF]' : 'fa-solid fa-bell-slash text-[#929292]'"></i> 
            <span :class="{'text-black': !isMuted, 'text-[#2AA8FF]': isMuted}">
              {{ isMuted ? 'Unmute Chat' : 'Mute Chat (1 Jam)' }}
            </span>
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
            <i v-if="loading && currentAction === 'delete'" class="fa-solid fa-spinner fa-spin ml-auto text-red-600"></i>
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
  }
})

const emit = defineEmits(['update:isOpen', 'action-complete'])
const chatStore = useChatStore()

const loading = ref(false)
const currentAction = ref(null) 

const chatTitle = computed(() => {
    if (props.chat.name) return props.chat.name;
    const currentUserId = chatStore.currentUserId; 
    
    if (props.chat.participants && props.chat.participants.length > 0) {
      const otherParticipant = props.chat.participants.find(
        (p) => String(p.id) !== String(currentUserId)
      );
      
      return otherParticipant?.username || otherParticipant?.fullname || "Chat Privat";
    }
    return "Chat Opsi";
})

// ✅ PERBAIKAN: Cek status pin dari participants menggunakan id
const isPinned = computed(() => {
    if (!props.chat.participants) return false;
    const currentUserId = chatStore.currentUserId;
    
    const participant = props.chat.participants.find(p => 
        String(p.id) === String(currentUserId)
    );
    
    return participant?.pinned ?? false;
});

// ✅ PERBAIKAN: Gunakan field 'muted' dari backend (lebih reliable)
const isMuted = computed(() => {
    if (!props.chat.participants) {
        console.log('❌ No participants found');
        return false;
    }
    const currentUserId = chatStore.currentUserId;
    
    const participant = props.chat.participants.find(p => 
        String(p.id) === String(currentUserId)
    );
    
    console.log('🔍 Checking mute status:', {
        currentUserId,
        participant,
        muted_from_backend: participant?.muted,  // ✅ Langsung pakai dari backend
        mute_until: participant?.mute_until
    });
    
    // ✅ Prioritas 1: Gunakan field 'muted' dari backend (sudah dihitung di ChatResource)
    if (participant && typeof participant.muted !== 'undefined') {
        return participant.muted;
    }
    
    // ✅ Fallback: Hitung manual jika field 'muted' tidak ada
    const muteUntil = participant?.mute_until;
    const isMutedStatus = muteUntil && new Date(muteUntil) > new Date();
    
    console.log('📊 Mute fallback calculation:', {
        muteUntil,
        now: new Date(),
        isMutedStatus
    });
    
    return isMutedStatus; 
});

function close() {
  emit('update:isOpen', false)
}

// --- HANDLER LOGIC ---
async function togglePin() {
    currentAction.value = 'pin';
    loading.value = true;
    const wasPinned = isPinned.value; // Simpan status sebelum update
    try {
        const payload = { pinned: !isPinned.value };
        await chatStore.updateChatStatus(props.chat.id, payload);
        close();
        emit('action-complete', wasPinned ? 'Chat berhasil di-unpin.' : 'Chat berhasil di-pin.');
    } catch (error) {
        console.error("Gagal Pin/Unpin:", error);
    } finally {
        loading.value = false;
        currentAction.value = null;
    }
}

async function toggleMute() {
    currentAction.value = 'mute';
    loading.value = true;
    
    const wasMuted = isMuted.value;
    let payload = {};
    let message = '';

    if (wasMuted) {
        payload = { mute_until: null }; 
        message = 'Chat berhasil di-unmute.';
    } else {
        const muteUntil = new Date();
        muteUntil.setHours(muteUntil.getHours() + 1);
        payload = { mute_until: muteUntil.toISOString() };
        message = 'Chat berhasil dimute selama 1 jam.';
    }

    console.log('🚀 Sending mute request:', {
        chatId: props.chat.id,
        payload,
        wasMuted,
        currentParticipants: props.chat.participants
    });

    try {
        const response = await chatStore.updateChatStatus(props.chat.id, payload);
        console.log('✅ Mute response:', response);
        console.log('✅ Response data:', response?.data);
        
        // Force refresh chat data dari store
        await chatStore.fetchChatById(props.chat.id);
        
        console.log('📦 Updated chat after refresh:', props.chat);
        console.log('📊 New isMuted status:', isMuted.value);
        
        close();
        emit('action-complete', message);
    } catch (error) {
        console.error(`❌ Gagal ${wasMuted ? 'Unmute' : 'Mute'}:`, error);
        console.error('Error details:', error.response?.data);
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
        await chatStore.deleteChat(props.chat.id, 'me'); 
        
        close();
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