<template>
  <div class="space-y-5">
    <CommunityPostCard
      v-for="item in posts"
      :key="item.id"
      :post="item"
      @click="$emit('select', item)"
    />
  </div>
</template>

<script setup>
import CommunityPostCard from './CommunityPostCard.vue';

defineProps({
  posts: Array
});
</script>
