<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Hapus Artikel</h1>

    <div class="p-4 border border-red-400 bg-red-50 rounded-lg mb-4">
      <p class="text-red-700">
        Apakah Anda yakin ingin menghapus artikel:
        <strong>{{ title }}</strong>?
      </p>
    </div>

    <div class="flex gap-4">
      <button
        @click="deleteArticle"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
      >
        Ya, Hapus
      </button>

      <button
        @click="$router.push('/articles')"
        class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        Batal
      </button>
    </div>

    <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
  </div>
</template>

<script>
import api from "../service/api";

export default {
  data() {
    return {
      title: "",
      error: null,
    };
  },

  async created() {
    const id = this.$route.params.id;

    try {
      const res = await api.get("/articles/" + id);
      this.title = res.data.data.title;
    } catch (err) {
      this.error = "Artikel tidak ditemukan";
    }
  },

  methods: {
    async deleteArticle() {
      const id = this.$route.params.id;

      try {
        await api.delete("/articles/" + id);
        this.$router.push("/articles");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal menghapus artikel";
      }
    },
  },
};
</script>
