<template>
  <div class="relative p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md transition cursor-pointer">

    <!-- TITLE -->
    <h3 class="font-semibold text-primary mb-2 line-clamp-1">
      {{ post.title }}
    </h3>

    <!-- CONTENT -->
    <p class="text-sm text-secondary line-clamp-2">
      {{ post.content }}
    </p>

    <div class="mt-4 flex items-center justify-between text-xs text-secondary-dark">
      <span>{{ authorName }}</span>
      <span>{{ formattedDate }}</span>
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

// CommunityPostCard.vue

<script setup>
import { computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  currentUserId: Number
});

// Perbaikan: Ambil username dari objek 'user' di dalam post.
const authorName = computed(() => {
  // Gunakan optional chaining (?.) untuk menghindari error jika objek 'user' tidak ada.
  // Fallback ke User ID jika username tidak tersedia.
  return props.post.user?.username || `User ID ${props.post.user_id}`; 
});

// Format tanggal dari created_at (kode Anda ini sudah benar)
const formattedDate = computed(() => {
  if (!props.post.created_at) return "";
  
  try {
    const d = new Date(props.post.created_at);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (error) {
    console.error('Invalid date:', props.post.created_at);
    return "";
  }
});
</script>