//Versi 1
<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Semua Artikel</h1>

      <button
        @click="$router.push('/articles/create')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
      >
        + Buat Artikel
      </button>
    </div>

    <!-- If kosong -->
    <p v-if="articles.length === 0" class="text-gray-500 text-center mt-6">
      Belum ada artikel. Buat satu sekarang ✨
    </p>

    <!-- Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="a in articles"
        :key="a.id"
        class="relative p-5 border rounded-xl shadow hover:shadow-lg cursor-pointer bg-white transition"
        @click="openDetail(a.id)"
      >
        <!-- Tombol Menu -->
        <div class="absolute top-3 right-3">
          <button
            class="p-1 rounded-lg hover:bg-gray-200"
            @click.stop="toggleMenu(a)"
          >
            ⋮
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="a.showMenu"
            class="absolute right-0 mt-2 w-28 bg-white border shadow-lg rounded-xl overflow-hidden z-20"
          >
          <button
              class="block w-full text-left px-1 py-2 hover:bg-gray-100 flex items-center gap-2"
              @click.stop="handleBookmarkArticle(a)"
            >
              🔖Bookmark
              <!-- ini ada gambarnya -->
            </button>

            <button
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              @click="$router.push('/articles/edit/' + a.id)"
            >
              ✏️ Edit
            </button>

            <button
              class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              @click.stop="deleteArticle(a.id)"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        <!-- Judul & Preview -->
        <h2 class="font-semibold text-xl mb-1 line-clamp-1">
          {{ a.title }}
        </h2>
        <p class="text-gray-600 text-sm line-clamp-2">
          {{ a.content }}
        </p>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import api from "../service/api";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const articles = ref([]);

// Toggle menu
const toggleMenu = (item) => {
  articles.value.forEach(a => a.showMenu = false);
  item.showMenu = !item.showMenu;
};

// Open detail article
const openDetail = (id) => {
  router.push(`/articles/${id}`);
};

// Fetch data
onMounted(async () => {
  const res = await api.get("/articles");
  articles.value = res.data.data.map(a => ({ ...a, showMenu: false }));
});

// Delete
const deleteArticle = async (id) => {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;
  await api.delete(`/articles/${id}`);
  articles.value = articles.value.filter(a => a.id !== id);
};
</script>






//versi ai langsung
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
        class="relative p-5 border rounded-xl shadow-sm hover:shadow-md bg-white cursor-pointer"
        @click="openDetail(a.id)"
      >

        <!-- Tombol titik tiga -->
        <button
          class="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
          @click.stop="toggleMenu(a)"
        >
          ⋮
        </button>

        <!-- Dropdown -->
        <div
          v-if="a.showMenu"
          class="absolute top-10 right-3 w-36 bg-white border shadow-lg rounded-lg z-20"
        >
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            @click.stop="handleBookmarkArticle(a)"
          >
            🔖 Bookmark
          </button>

          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100"
            @click.stop="$router.push('/articles/edit/' + a.id)"
          >
            ✏️ Edit
          </button>

          <button
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            @click.stop="deleteArticle(a.id)"
          >
            🗑️ Delete
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
import BookmarkModal from "../components/BookmarkModal.vue";

const router = useRouter();
const articles = ref([]);
const showBookmarkModal = ref(false);
const bookmarkItem = ref({ type: '', id: null, title: '' });

// Menutup menu saat klik di luar
const handleClickOutside = (e) => {
  if (!e.target.closest(".relative")) {
    articles.value.forEach(a => a.showMenu = false);
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
  articles.value = res.data.data.map(a => ({ ...a, showMenu: false }));
};

const toggleMenu = (item) => {
  articles.value.forEach(a => a.showMenu = false);
  item.showMenu = !item.showMenu;
};

const handleBookmarkArticle = (article) => {
  bookmarkItem.value = {
    type: 'article',
    id: article.id,
    title: article.title
  };
  showBookmarkModal.value = true;
  article.showMenu = false;
};

const handleBookmarkSaved = (message) => {
  showBookmarkModal.value = false;
  alert(message);
};

const deleteArticle = async (id) => {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;
  await api.delete(`/articles/${id}`);
  articles.value = articles.value.filter(a => a.id !== id);
};

// Buka detail artikel
const openDetail = (id) => {
  router.push(`/articles/${id}`);
};
</script>
