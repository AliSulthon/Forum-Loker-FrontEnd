
<template>
  <div>
    <h2>Semua Artikel</h2>
    <button @click="$router.push('/create-article')">+ Tambah Artikel</button>

    <ul>
      <li v-for="a in articles" :key="a.id">
        <strong>{{ a.title }}</strong>  
        <p>{{ a.content }}</p>
        <button @click="$router.push('/articles/' + a.id)">Detail</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../service/api';

export default {
  data() {
    return {
      articles: []
    };
  },
  async created() {
    const res = await api.get('/articles');
    this.articles = res.data.data;
  }
};
</script>
