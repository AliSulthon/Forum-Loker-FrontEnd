<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-5">Buat Artikel Baru</h1>

    <form @submit.prevent="createArticle" class="space-y-4">
      <input
        v-model="title"
        placeholder="Judul Artikel"
        class="w-full p-3 border rounded-lg"
      />

      <textarea
        v-model="content"
        placeholder="Isi artikel"
        class="w-full p-3 border rounded-lg h-40"
      ></textarea>

      <button
        type="submit"
        class="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-light"
      >
        Buat Artikel
      </button>
    </form>

    <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
  </div>
</template>

<script>
import api from "../service/api";

export default {
  data() {
    return {
      title: "",
      content: "",
      error: null,
    };
  },
  methods: {
    async createArticle() {
      try {
        await api.post("/articles", {
          title: this.title,
          content: this.content,
        });

        this.$router.push("/articles");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal membuat artikel.";
      }
    },
  },
};
</script>
