<template>
  <div>
    <CommunityCard
      v-for="c in communities"
      :key="c.id"
      :community="c"
    />
  </div>
</template>

<script setup>
import CommunityCard from "./CommunityCard.vue";

defineProps({
  communities: Array
});
</script>
