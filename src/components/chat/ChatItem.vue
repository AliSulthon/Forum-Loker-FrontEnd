<template>
  <div
    class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none border-b hover:bg-[#E9E9E9] transition group"
    :class="active ? 'bg-[#97DFF4]' : 'bg-[#FFFFFF]'" 
    @click="$emit('click')"
  >
    <div
      class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-[#FFFFFF] font-semibold text-xl"
      :class="active ? 'bg-[#2AA8FF]' : 'bg-[#929292]'"
    >
      <span class="uppercase select-none">
        {{ chatInitial }}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      
      <div class="flex justify-between items-center mb-1">
        <h3 class="font-semibold text-black truncate text-base flex items-center gap-1">
          <i v-if="isPinned" class="fa-solid fa-thumbtack text-xs text-[#2AA8FF] flex-shrink-0"></i>
          
          <i v-if="isMuted" class="fa-solid fa-bell-slash text-xs text-[#929292] flex-shrink-0"></i>
          
          <span :class="{'ml-1': isPinned || isMuted}">
            {{ displayTitle }}
          </span>
        </h3>

        <span class="text-xs text-[#929292] whitespace-nowrap ml-2">
          {{ displayTime }}
        </span>
      </div>

      <div class="flex justify-between items-center gap-2">
        <p class="text-sm text-[#929292] truncate flex items-center gap-1 flex-1">
          <span v-if="isLastMessageMine" class="text-xs">
            <i class="fa-solid fa-check text-[#929292]"></i>
          </span>
          
          {{ displayLastMessage }}
        </p>

        <div 
          v-if="unreadCount > 0" 
          class="bg-green-500 text-white text-xs font-bold h-5 min-w-[1.25rem] px-1.5 rounded-full flex items-center justify-center flex-shrink-0"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </div>
      </div>

    </div>
    
    <button 
        @click.stop="$emit('open-menu')"
        class="ml-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-gray-300 flex-shrink-0"
        :class="{'opacity-100': active}"
        title="Opsi Chat"
    >
      <img :src="editIcon" alt="Edit Options" class="w-5 h-5 text-[#929292]" />
      </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

// --- PENTING: IMPORT ASSET SVG BARU ---
// Sesuaikan path import ini agar sesuai dengan struktur folder proyek Anda.
import editIcon from "@/assets/edit.svg"; 

const props = defineProps({
// ... (props lain tetap sama)
// ... (props lain tetap sama)
// ... (props lain tetap sama)
  chat: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click", "open-menu"]); 

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);

// --- LOGIKA COMPUTED PROPERTI LAINNYA TETAP SAMA ---

const unreadCount = computed(() => {
  return props.chat.unread_count || 0;
});
// ... (kode computed lainnya tetap sama)
const isPinned = computed(() => {
    if (!props.chat.participants) return false;

    // ✅ KOREKSI: Mencari partisipan berdasarkan 'id' karena ChatResource Anda menggunakannya.
    const participant = props.chat.participants.find(p => 
        String(p.id) === String(currentUserId.value)
    );
    return participant?.pinned || false;
});

const isMuted = computed(() => {
    if (!props.chat.participants) return false;
    
    // ✅ KOREKSI: Mencari partisipan berdasarkan 'id'.
    // Properti 'muted' diasumsikan ada setelah koreksi di ChatResource (langkah sebelumnya).
    const participant = props.chat.participants.find(p => 
        String(p.id) === String(currentUserId.value)
    );
    // Kita cek properti 'muted' yang kita tambahkan di ChatResource
    return participant?.muted || false; 
});


const displayTitle = computed(() => {
  if (props.chat.name) return props.chat.name; 
  
  // Menggunakan logika yang sudah bekerja (berdasarkan p.id)
  if (props.chat.participants && props.chat.participants.length > 0) {
    const otherParticipant = props.chat.participants.find(
      (p) => String(p.id) !== String(currentUserId.value)
    );
    
    return otherParticipant?.username || otherParticipant?.fullname || "Unknown User";
  }

  return "Chat"; 
});


const chatInitial = computed(() => {
  const title = displayTitle.value || "?";
  return Array.from(title)[0].toUpperCase();
});


const displayTime = computed(() => {
  const dateString = props.chat.last_message?.created_at || props.chat.updated_at;
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, 
  }).format(date);
});


const displayLastMessage = computed(() => {
  const msg = props.chat.last_message;
  
  if (!msg) return "Belum ada pesan";

  if (!msg.text && msg.attachments && msg.attachments.length > 0) {
      return "📎 Lampiran"; 
  }

  return msg.text || "Pesan kosong";
});

const isLastMessageMine = computed(() => {
  const msg = props.chat.last_message;
  if (!msg) return false;
  return String(msg.user_id) === String(currentUserId.value);
});
</script>