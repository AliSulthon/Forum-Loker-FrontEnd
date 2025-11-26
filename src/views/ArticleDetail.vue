<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Back -->
    <button
      @click="$router.back()"
      class="text-blue-600 hover:underline mb-4"
    >
      ← Kembali
    </button>

    <!-- Title -->
    <h1 class="text-4xl font-bold mb-3">{{ article.title }}</h1>

    <!-- Metadata -->
    <p class="text-gray-500 mb-6 text-sm">
      Ditulis oleh: {{ article.user?.username || "Unknown" }} • {{ formattedDate }}
    </p>

    <!-- Content -->
    <p class="text-lg leading-relaxed whitespace-pre-line">
      {{ article.content }}
    </p>

    <!-- Actions: Edit & Delete -->
    <div class="mt-8 flex gap-4" v-if="isOwner">
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
    </div>

    <div class="mt-8 flex gap-4">

        <!-- ini bookmark mu -->
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
        @click.stop="handleBookmarkArticle(a)"
        >
        🔖Bookmark
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../service/api";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const article = ref({});

// Ambil user_id dari localStorage
const loggedInUserId = Number(JSON.parse(localStorage.getItem("user_info"))?.id);

// Cek apakah current user pemilik artikel
const isOwner = computed(() => Number(article.value.user_id) === loggedInUserId);

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
    const res = await api.get(`/articles/${route.params.id}`);
    article.value = res.data.data;
  } catch (error) {
    alert("Artikel tidak ditemukan.");
    router.push("/articles");
  }
});

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
