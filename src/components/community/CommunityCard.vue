<template>
  <div
    class="relative p-8 rounded-2xl border border-primary shadow-sm bg-white 
           hover:shadow-md hover:border-primary-light 
           transition-transform transform hover:scale-105 duration-200 cursor-pointer
           min-h-[220px]"
    @click="$emit('click')"
  >
    <!-- Penanda kepemilikan di pojok kanan atas -->
    <span
      v-if="community.isOwner"
      class="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow"
    >
      Your Community
    </span>

    <!-- Nama komunitas -->
    <h2 class="text-2xl font-semibold text-black mb-3 line-clamp-1">
      {{ community.name }}
    </h2>

    <!-- Deskripsi -->
    <p class="text-detail line-clamp-3">
      {{ community.description }}
    </p>

    <!-- Tombol detail di pojok kanan bawah -->
    <span
      class="absolute bottom-4 right-4 text-primary font-medium hover:underline cursor-pointer text-sm"
    >
      See details →
    </span>
  </div>
</template>

<script setup>
defineProps({
  community: Object
});
</script>
