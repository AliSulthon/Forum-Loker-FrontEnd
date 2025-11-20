<template>
  <div class="card" @click="$router.push(`/posts/${post.id}`)">
    <h4>{{ post.title }}</h4>
    <p>{{ post.content }}</p>
  </div>
</template>

<script setup>
defineProps({
  post: Object
});
</script>
