<template>
  <div class="p-6">
    <!-- Header -->
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
          class="absolute top-10 right-3 w-28 bg-white border shadow-lg rounded-lg z-20"
        >
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
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();
const articles = ref([]);
const openMenu = ref(null);

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

const deleteArticle = async (id) => {
  if (!confirm("Yakin ingin menghapus artikel ini?")) return;

  await api.delete(`/articles/${id}`);
  articles.value = articles.value.filter((a) => a.id !== id);
  openMenu.value = null;
};
</script>
