<template>
  <div>
    <h2>{{ post?.title }}</h2>
    <p>{{ post?.content }}</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useCommunityPostStore } from "../../stores/communityPostStore";

const postStore = useCommunityPostStore();
const route = useRoute();

const postId = Number(route.params.id);
const post = postStore.getById(postId);
</script>
