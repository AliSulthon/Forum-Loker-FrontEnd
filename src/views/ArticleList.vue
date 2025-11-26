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
