<template>
  <div
    class="p-5 bg-white rounded-2xl border border-primary shadow-sm hover:shadow-md"
    @click="$emit('click')"
  >
    <!-- Post Title -->
    <h3 class="text-base font-semibold text-primary mb-2 line-clamp-1">
      {{ post.title }}
    </h3>

    <!-- Post Content -->
    <p class="text-sm text-secondary line-clamp-2">
      {{ post.content }}
    </p>

    <!-- Post Meta -->
    <div class="mt-4 flex items-center justify-between text-xs text-secondary-dark">
      <span>{{ post.author }}</span>
      <span>{{ post.date }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: Object
});
</script>
