<template>
  <div class="space-y-5">
    <CommunityPostCard
      v-for="item in posts"
      :key="item.id"
      :post="item"
      :currentUserId="currentUserId"
      @click="$emit('select', item)"
      @edit="$emit('edit', item)"
      @delete="$emit('delete', item)"
    />
  </div>
</template>

<script setup>
import CommunityPostCard from './CommunityPostCard.vue';

defineProps({
  posts: Array,
  currentUserId: Number
});
</script>
