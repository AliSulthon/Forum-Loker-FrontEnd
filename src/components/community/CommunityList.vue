<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <CommunityCard
      v-for="item in communities"
      :key="item.id"
      :community="item"
      @click="$emit('select', item)"
    />
  </div>
</template>

<script setup>
import CommunityCard from './CommunityCard.vue';

defineProps({
  communities: Array
});
</script>
