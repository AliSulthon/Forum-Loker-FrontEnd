<template>
  <div class="relative p-5 bg-white rounded-2xl border shadow-sm">

    <!-- TITLE -->
    <h3 class="text-base font-semibold text-primary mb-2 line-clamp-1">
      {{ post.title }}
    </h3>

    <!-- CONTENT -->
    <p class="text-sm text-secondary line-clamp-2">
      {{ post.content }}
    </p>

    <div class="mt-4 flex items-center justify-between text-xs text-secondary-dark">
      <span>{{ post.author }}</span>
      <span>{{ post.date }}</span>
    </div>

    <!-- EDIT / DELETE ONLY IF OWNER -->
    <div
      v-if="post.user_id === currentUserId"
      class="absolute top-3 right-3 flex gap-2"
    >
      <button
        class="text-blue-600 text-sm hover:underline"
        @click.stop="$emit('edit', post)"
      >
        Edit
      </button>

      <button
        class="text-red-600 text-sm hover:underline"
        @click.stop="$emit('delete', post)"
      >
        Delete
      </button>
    </div>

  </div>
</template>

<script setup>
defineProps({
  post: Object,
  currentUserId: Number
});
</script>
