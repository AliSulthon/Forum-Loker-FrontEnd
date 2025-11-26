<template>
    <div class="max-w-4xl mx-auto">
      
      <div v-if="loading" class="py-12 flex flex-col items-center justify-center gap-4 text-[#929292]">
        <span class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></span>
        <span class="text-lg font-medium">Memuat postingan...</span>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
        <p class="font-bold text-lg mb-2">Terjadi Kesalahan</p>
        <p>{{ error }}</p>
        <RouterLink to="/" class="mt-4 inline-block text-primary hover:underline font-medium">
          &larr; Kembali ke Home
        </RouterLink>
      </div>

      <div v-else-if="post" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-8">
          <div class="mb-8 pb-6 border-b border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                Post
              </span>
              <span class="text-gray-400 text-sm">{{ formatDate(post.created_at) }}</span>
            </div>

            <h1 class="text-3xl md:text-4xl font-bold font-namaApp text-gray-900 mb-6 leading-tight">
              {{ post.title }}
            </h1>

            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div>
                  <p class="font-bold text-gray-900 text-lg">{{ post.user?.username || 'Anonymous' }}</p>
                  <p class="text-sm text-gray-500">Penulis</p>
                </div>
              </div>

              <!-- Bookmark button -->
              <button
                @click="handleBookmarkPost"
                class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 flex items-center gap-2 transition"
              >
                🔖 Bookmark
              </button>
            </div>
          </div>

          <div class="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-10">
            {{ post.content }}
          </div>

          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-xl font-bold font-namaApp mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Komentar ({{ post.comments?.length || 0 }})
            </h3>

            <div class="space-y-4">
              <div v-for="comment in post.comments" :key="comment.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4">
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-gray-900">{{ comment.user?.username || 'User' }}</span>
                    <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="text-gray-700">{{ comment.content }}</p>
                </div>
              </div>

              <div v-if="!post.comments || post.comments.length === 0" class="text-center py-8 text-gray-400">
                Belum ada komentar di postingan ini.
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Bookmark Modal -->
      <BookmarkModal
        :show="showBookmarkModal"
        :item-type="bookmarkItem.type"
        :item-id="bookmarkItem.id"
        :item-title="bookmarkItem.title"
        @close="showBookmarkModal = false"
        @saved="handleBookmarkSaved"
      />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import BookmarkModal from '../components/BookmarkModal.vue';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// Bookmark state
const showBookmarkModal = ref(false);
const bookmarkItem = ref({ type: '', id: null, title: '' });

const fetchPostDetail = async () => {
  try {
    const postId = route.params.id;
    const response = await api.get(`/posts/${postId}`);
    post.value = response.data.data; 
  } catch (err) {
    console.error(err);
    error.value = err.response?.status === 404 
      ? "Postingan tidak ditemukan." 
      : "Gagal memuat postingan. Pastikan server berjalan.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// Bookmark functions
const handleBookmarkPost = () => {
  bookmarkItem.value = {
    type: 'post',
    id: post.value.id,
    title: post.value.title
  };
  showBookmarkModal.value = true;
};

const handleBookmarkSaved = (message) => {
  showBookmarkModal.value = false;
  alert(message);
};

onMounted(() => {
  fetchPostDetail();
});
</script>