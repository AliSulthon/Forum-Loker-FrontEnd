<template>
  <div class="grid grid-cols-2 gap-6">
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
