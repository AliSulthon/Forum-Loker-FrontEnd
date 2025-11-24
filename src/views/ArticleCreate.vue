<template>
  <div>
    <h2>Buat Artikel</h2>

    <form @submit.prevent="createArticle">
      <input v-model="title" placeholder="Judul" />
      <textarea v-model="content" placeholder="Isi artikel"></textarea>
      <button type="submit">Buat</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import api from '../service/api';

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
        await api.post('/articles', {
          title: this.title,
          content: this.content
        });
        this.$router.push('/articles');
      } catch (err) {
        this.error = err.response.data.message || "Gagal membuat artikel";
      }
    }
  }
};
</script>
