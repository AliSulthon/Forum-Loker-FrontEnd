<template>
  <div>
    <h2>All Communities</h2>
    <button @click="$router.push('/communities/create')">+ Create Community</button>

    <CommunityList :communities="communities" />
  </div>
</template>

<script setup>
import { useCommunityStore } from "../../stores/communityStore";
import CommunityList from "../../components/community/CommunityList.vue";

const store = useCommunityStore();
const communities = store.communities;
</script>
