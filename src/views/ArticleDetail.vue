<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-gray-500">Memuat artikel...</div>
    </div>

    <!-- Article content -->
    <div v-else-if="article.id">
      <!-- Back button -->
      <button
        @click="$router.back()"
        class="text-blue-600 hover:underline mb-4 flex items-center gap-2"
      >
        ← Kembali
      </button>

      <!-- Title -->
      <h1 class="text-4xl font-bold mb-4">{{ article.title }}</h1>

      <!-- Author & Metadata -->
      <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <RouterLink 
          v-if="article.user" 
          :to="{ name: 'user-profile', params: { id: article.user_id } }"
          class="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow">
            {{ article.user?.name?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ article.user?.name || 'Unknown' }}</p>
            <p class="text-xs text-gray-500">@{{ article.user?.username || 'user' }}</p>
          </div>
        </RouterLink>
        <span class="text-gray-400">•</span>
        <span class="text-sm text-gray-500">{{ formattedDate }}</span>
      </div>

      <!-- Content -->
      <div class="text-lg leading-relaxed whitespace-pre-line mb-8">
        {{ article.content }}
      </div>

      <!-- Actions -->
      <div class="mt-8 flex gap-4 flex-wrap">
        <!-- Bookmark button (for everyone) -->
        <button
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 flex items-center gap-2"
          @click="handleBookmarkArticle"
        >
          🔖 Bookmark
        </button>

        <!-- Edit & Delete (only for owner) -->
        <template v-if="isOwner">
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            @click="$router.push('/articles/edit/' + article.id)"
          >
            ✏️ Edit
          </button>

          <button
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            @click="deleteArticle"
          >
            🗑️ Hapus
          </button>
        </template>
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
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { useRoute, useRouter } from "vue-router";
import BookmarkModal from "../components/BookmarkModal.vue";

const route = useRoute();
const router = useRouter();
const article = ref({});
const loading = ref(true);
const showBookmarkModal = ref(false);
const bookmarkItem = ref({ type: '', id: null, title: '' });

// Ambil user_id dari localStorage
const getUserId = () => {
  try {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? Number(JSON.parse(userInfo)?.id) : null;
  } catch {
    return null;
  }
};

const loggedInUserId = getUserId();

// Cek apakah current user pemilik artikel
const isOwner = computed(() => {
  return article.value.user_id && loggedInUserId && Number(article.value.user_id) === loggedInUserId;
});

// Format tanggal
const formattedDate = computed(() =>
  article.value.created_at
    ? new Date(article.value.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
);

// Fetch detail artikel
onMounted(async () => {
  try {
    loading.value = true;
    const res = await api.get(`/articles/${route.params.id}`);
    article.value = res.data.data;
  } catch (error) {
    console.error("Error loading article:", error);
    alert("Artikel tidak ditemukan.");
    router.push("/articles");
  } finally {
    loading.value = false;
  }
});

// Handle bookmark article
const handleBookmarkArticle = () => {
  bookmarkItem.value = {
    type: 'article',
    id: article.value.id,
    title: article.value.title
  };
  showBookmarkModal.value = true;
};

// Handle bookmark saved
const handleBookmarkSaved = (message) => {
  showBookmarkModal.value = false;
  alert(message);
};

// Delete artikel
const deleteArticle = async () => {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;
  try {
    await api.delete(`/articles/${route.params.id}`);
    alert("Artikel berhasil dihapus.");
    router.push("/articles");
  } catch (error) {
    alert(error.response?.data?.message || "Gagal menghapus artikel.");
  }
};
</script>