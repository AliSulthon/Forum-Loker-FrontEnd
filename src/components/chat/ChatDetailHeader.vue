<template>
  <div
    class="h-16 px-4 flex items-center justify-between border-b bg-[#FFFFFF] shadow-sm"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-[#929292] flex items-center justify-center text-[#FFFFFF] font-semibold text-lg select-none"
      >
        {{ initial }}
      </div>

      <div class="flex flex-col justify-center">
        <h2 class="font-semibold text-black truncate text-base">
          {{ displayTitle }}
        </h2>
        
        <p class="text-xs text-[#929292]">
          {{ isGroupChat ? (chat?.status || 'Online') : displaySubTitle }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="$emit('searchMessages')"
        class="p-2 rounded-full hover:bg-[#E9E9E9] transition"
        title="Search"
      >
        <img :src="searchIcon" alt="Search" class="w-5 h-5" /> 
      </button>
      </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
// --- ASUMSI: IMPORT ASSET SVG ---
// Path ini diasumsikan benar relatif terhadap komponen Anda atau diresolve oleh alias '@/'
import searchIcon from "@/assets/search.svg"; // <--- PENTING: Lakukan import ini!
// Jika komponen ini berada di 'src/components/' dan aset berada di 'src/assets/', 
// pathnya mungkin perlu disesuaikan, misalnya: '../assets/search.svg' atau menggunakan alias:
// import searchIcon from "@/assets/search.svg"; 
// Sesuaikan path import di atas dengan struktur folder proyek Anda yang sebenarnya.

const props = defineProps({
  chat: {
    type: Object,
    default: () => null
  }
});

defineEmits(["searchMessages"]);
const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);

// --- HELPER: MENDAPATKAN OBJEK LAWAN BICARA ---
const otherParticipant = computed(() => {
    if (!props.chat || !props.chat.participants) return null;

    // Cari partisipan yang ID-nya BUKAN ID user saat ini
    const other = props.chat.participants.find(
        (p) => String(p.id) !== String(currentUserId.value)
    );
    return other;
});

// --- HELPER: CEK APAKAH INI GROUP CHAT ---
const isGroupChat = computed(() => {
    // Asumsi: Jika ada 'chat.name', itu Group Chat
    return !!props.chat?.name;
});


// --- 1. LOGIKA JUDUL/NAMA (TETAP SAMA) ---
const displayTitle = computed(() => {
    if (isGroupChat.value) {
        return props.chat.name; // Judulnya adalah nama grup
    }

    // Jika private chat, gunakan username lawan bicara
    const other = otherParticipant.value;
    return other?.username || other?.fullname || "Unknown User";
});

// --- 🎯 LOGIKA SUB-JUDUL BARU (NAMA LENGKAP) ---
const displaySubTitle = computed(() => {
    // Jika Group Chat, ini akan diabaikan oleh template di atas
    const other = otherParticipant.value;
    
    // Tampilkan fullname, fallback ke username, fallback ke 'Private Chat'
    return other?.fullname || other?.username || "Private Chat";
});


// --- 2. LOGIKA INISIAL ---
const initial = computed(() => {
  const title = displayTitle.value || "?";
  return Array.from(title)[0].toUpperCase();
});
</script>