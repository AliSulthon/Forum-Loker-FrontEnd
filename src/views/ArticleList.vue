<template>
  <div class="p-6">
    <!--Header -->
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold">Semua Artikel</h1>
      <button
        @click="$router.push('/articles/create')"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
      >
        + Artikel Baru
      </button>
    </div>

    <!-- Jika kosong -->
    <div v-if="articles.length === 0" class="text-gray-500">
      Belum ada artikel.
    </div>

    <!-- List artikel -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="a in articles"
        :key="a.id"
        class="relative p-5 border rounded-xl shadow-sm hover:shadow-md bg-white"
      >

        <!-- Tombol titik tiga -->
        <button
          class="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
          @click="toggleMenu(a.id)"
        >
          ⋮
        </button>

        <!-- Dropdown -->
        <div
          v-if="openMenu === a.id"
          class="absolute top-10 right-3 w-36 bg-white border shadow-lg rounded-lg z-20"
        >
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            @click="handleBookmarkArticle(a)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            Bookmark
          </button>

          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100"
            @click="$router.push('/articles/edit/' + a.id)"
          >
            Edit
          </button>

          <button
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            @click="deleteArticle(a.id)"
          >
            Delete
          </button>
        </div>

        <!-- Isi -->
        <h2 class="font-semibold text-lg line-clamp-1 mt-2">
          {{ a.title }}
        </h2>
        <p class="text-gray-700 line-clamp-2">
          {{ a.content }}
        </p>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";
import { useBookmarksStore } from "../stores/bookmarks";
import BookmarkModal from "../components/BookmarkModal.vue";

const bookmarksStore = useBookmarksStore();

const router = useRouter();
const articles = ref([]);
const openMenu = ref(null);
const showBookmarkModal = ref(false);
const bookmarkItem = ref({ type: '', id: null, title: '' });

// Menutup menu saat klik di luar
const handleClickOutside = (e) => {
  if (!e.target.closest(".relative")) {
    openMenu.value = null;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  loadArticles();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

const loadArticles = async () => {
  const res = await api.get("/articles");
  articles.value = res.data.data;
};

const toggleMenu = (id) => {
  openMenu.value = openMenu.value === id ? null : id;
};

const handleBookmarkArticle = (article) => {
  bookmarkItem.value = {
    type: 'article',
    id: article.id,
    title: article.title
  };
  showBookmarkModal.value = true;
  openMenu.value = null;
};

const handleBookmarkSaved = (message) => {
  showBookmarkModal.value = false;
  alert(message);
};

const deleteArticle = async (id) => {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;

  await api.delete(`/articles/${id}`);
  articles.value = articles.value.filter((a) => a.id !== id);
  openMenu.value = null;
};
</script>
