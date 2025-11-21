<template>
  <div
  class="p-5 rounded-2xl border border-primary shadow-sm bg-white 
         hover:shadow-md hover:border-primary-light 
         transition-transform transform hover:scale-105 duration-200 cursor-pointer"
  @click="$emit('click')"
>
    <!-- Nama komunitas -->
    <h2 class="text-xl font-semibold text-black mb-1 line-clamp-1">
      {{ community.name }}
    </h2>

    <!-- Deskripsi -->
    <p class="text-base text-gray-700 line-clamp-2">
      {{ community.description }}
    </p>

  </div>
</template>

<script setup>
defineProps({
  community: Object
});
</script>
