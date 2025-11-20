<template>
  <CommunityPostCard
    v-for="p in posts"
    :key="p.id"
    :post="p"
  />
</template>

<script setup>
import CommunityPostCard from "./CommunityPostCard.vue";

defineProps({
  posts: Array
});
</script>
