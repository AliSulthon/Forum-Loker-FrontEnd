<template>
  <div class="p-3 bg-white">
    <div
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 focus-within:ring-2 ring-[#14BEF0] transition"
    >
      <i class="fa-solid fa-magnifying-glass text-[#929292]"></i>

      <input
        v-model="query"
        @input="onInput"
        type="text"
        class="flex-1 bg-transparent outline-none text-sm text-[#000000]"
        placeholder="Cari nama kontak..."
        @keyup.enter="performSearch" 
      />

      <button
        v-if="query"
        @click="clear"
        class="text-[#14BEF0] hover:text-[#2AA8FF] transition p-1 rounded-full text-lg flex items-center justify-center" 
        title="Clear search"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const emit = defineEmits(['search'])

let searchTimeout = null

const performSearch = () => {
  // Mengirim string kosong ('') jika query null/undefined, atau string yang sudah di-trim
  const searchValue = query.value ? query.value.trim() : ''
  
  // Emit ke Parent. Parent yang bertugas filter by 'NAME' saja.
  emit('search', searchValue)
}

const onInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  // Delay 500ms untuk mengurangi beban server
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 500)
}

const clear = () => {
  query.value = ''
  performSearch()
}
</script>