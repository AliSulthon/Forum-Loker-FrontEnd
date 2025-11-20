<template>
  <div>
    <h1>Community Posts</h1>

    <router-link :to="'/communities/' + route.params.id + '/posts/create'">
      + Create Post
    </router-link>

    <CommunityPostList :posts="posts" />
  </div>
</template>

<script setup>
import { useCommunityPostStore } from '../../stores/communityPostStore'
import CommunityPostList from '../../components/communityPosts/CommunityPostList.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useCommunityPostStore()

const posts = store.getByCommunity(route.params.id)
</script>
