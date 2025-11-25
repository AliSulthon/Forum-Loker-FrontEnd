<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold">Semua Artikel</h1>
      <button
        @click="$router.push('/articles/create')"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
      >
        + Artikel Baru
      </button>
    </div>

    <div v-if="articles.length === 0" class="text-gray-500">
      Belum ada artikel.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="a in articles"
        :key="a.id"
        class="p-5 border rounded-xl shadow-sm hover:shadow-md cursor-pointer"
      >
        <h2 class="font-semibold text-lg line-clamp-1">{{ a.title }}</h2>
        <p class="text-gray-700 line-clamp-2">{{ a.content }}</p>

        <div class="flex gap-3 mt-4">
          <button
            @click="$router.push('/articles/edit/' + a.id)"
            class="text-blue-600 hover:underline"
          >
            Edit
          </button>

          <button
            @click="$router.push('/articles/delete/' + a.id)"
            class="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../service/api";

export default {
  data() {
    return {
      articles: [],
    };
  },
  async created() {
    const res = await api.get("/articles");
    this.articles = res.data.data;
  },
};
</script>
