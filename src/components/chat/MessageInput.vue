<template>
  <div
    class="h-16 px-4 flex items-center gap-3 border-t bg-white"
  >
    <textarea
      v-model="text"
      class="flex-1 resize-none outline-none bg-gray-100 rounded-xl px-3 py-2 text-sm 
             focus:ring-2 ring-primary-300 transition"
      placeholder="Tulis pesan..."
      rows="1"
      @keydown.enter.prevent="handleEnter"
    ></textarea>

    <button
      class="w-10 h-10 flex items-center justify-center rounded-full 
             bg-primary-600 hover:bg-primary-700 transition shadow text-white shrink-0" 
      @click="send"
      :disabled="!canSend"
      :class="!canSend ? 'opacity-40 cursor-not-allowed' : ''"
    >
      <i class="fa-solid fa-paper-plane text-sm"></i>
      </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

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