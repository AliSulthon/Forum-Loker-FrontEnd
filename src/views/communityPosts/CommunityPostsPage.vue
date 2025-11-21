<template>
  <div class="max-w-6xl mx-auto py-10 px-4">

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-800">All Posts</h1>

      <button
        class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        @click="goCreate"
      >
        Create Post
      </button>
    </div>

    <CommunityPostList :posts="postStore.posts" @select="goDetail" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'
import CommunityPostList from '../../components/communityPosts/CommunityPostList.vue'

const router = useRouter()
const postStore = useCommunityPostStore()

function goDetail(post) {
  router.push('/community-posts/' + post.id)
}

function goCreate() {
  router.push('/community-posts/create')
}
</script>
