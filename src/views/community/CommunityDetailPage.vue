<template>
  <div>
    <h2>{{ community?.name }}</h2>
    <p>{{ community?.description }}</p>

    <h3>Posts</h3>
    <button @click="$router.push(`/communities/${communityId}/posts/create`)">
      + Add Post
    </button>

    <CommunityPostList :posts="posts" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useCommunityStore } from "../../stores/communityStore";
import { useCommunityPostStore } from "../../stores/communityPostStore";
import CommunityPostList from "../../components/communityPosts/CommunityPostList.vue";

const route = useRoute();
const communityId = Number(route.params.id);

const cStore = useCommunityStore();
const pStore = useCommunityPostStore();

const community = cStore.getById(communityId);
const posts = pStore.getByCommunity(communityId);
</script>
