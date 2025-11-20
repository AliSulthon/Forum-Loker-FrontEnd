<template>
  <div class="card" @click="$router.push(`/communities/${community.id}`)">
    <h3>{{ community.name }}</h3>
    <p>{{ community.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  community: Object
});
</script>

<style scoped>
.card { padding: 16px; border: 1px solid #aaa; margin-bottom: 10px; cursor: pointer; }
</style>
