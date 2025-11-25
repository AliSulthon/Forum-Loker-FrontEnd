<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-5">Edit Artikel</h1>

    <form @submit.prevent="updateArticle" class="space-y-4">
      <input
        v-model="title"
        placeholder="Judul"
        class="w-full p-3 border rounded-lg"
      />

      <textarea
        v-model="content"
        placeholder="Isi artikel"
        class="w-full p-3 border rounded-lg h-40"
      ></textarea>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500"
      >
        Simpan Perubahan
      </button>
    </form>

    <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      title: "",
      content: "",
      error: null,
    };
  },
  async created() {
    const id = this.$route.params.id;

    try {
      const res = await api.get("/articles/" + id);
      this.title = res.data.data.title;
      this.content = res.data.data.content;
    } catch (err) {
      this.error = "Artikel tidak ditemukan.";
    }
  },
  methods: {
    async updateArticle() {
      const id = this.$route.params.id;

      try {
        await api.put("/articles/" + id, {
          title: this.title,
          content: this.content,
        });

        this.$router.push("/articles");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal memperbarui artikel";
      }
    },
  },
};
</script>
