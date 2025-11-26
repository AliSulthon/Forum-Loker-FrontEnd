<template>
  <div
    class="h-16 px-4 flex items-center gap-3 border-t bg-white"
  >
    <textarea
      v-model="text"
      class="flex-1 resize-none outline-none bg-gray-100 rounded-xl px-3 py-2 text-sm 
             focus:ring-2 ring-[#14BEF0] transition" 
      placeholder="Tulis pesan..."
      rows="1"
      @keydown.enter.prevent="handleEnter"
    ></textarea>

    <button
      class="w-10 h-10 flex items-center justify-center rounded-full 
             bg-[#2AA8FF] hover:bg-[#14BEF0] transition shadow text-white shrink-0" 
      @click="send"
      :disabled="!canSend"
      :class="!canSend ? 'opacity-40 cursor-not-allowed' : ''"
    >
      <img :src="sendIcon" alt="Send" class="w-5 h-5" /> 
      </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

// --- PENTING: IMPORT ASSET SVG ---
// Pastikan file SVG menggunakan fill="currentColor" agar ikon menjadi putih (text-white).
import sendIcon from "@/assets/send.svg"; 

// Definisi event yang akan dipancarkan
const emit = defineEmits(["send"])

// State untuk input teks
const text = ref("")

// Computed properti untuk mengecek apakah pesan dapat dikirim (tidak kosong setelah trim)
const canSend = computed(() => text.value.trim() !== "")

// Fungsi untuk mengirim pesan
const send = () => {
  if (!canSend.value) return // Jangan kirim jika kosong

  emit("send", text.value.trim()) // Panggil event 'send' dengan isi pesan

  text.value = "" // Kosongkan input setelah mengirim
}

// Fungsi untuk menangani penekanan tombol Enter
const handleEnter = () => {
  send()
}
</script>