<template>
  <div class="max-w-5xl mx-auto py-10 px-4">

    <!-- Back Button -->
    <button
      class="text-primary hover:text-primary-light font-medium mb-6"
      @click="router.push('/communities')"
    >
      ← Back
    </button>

    <!-- Community Card -->
    <div class="bg-white border border-primary rounded-xl p-8 shadow-sm hover:shadow-md">
      <h1 class="text-3xl font-bold text-primary mb-2">
        {{ community?.name }}
      </h1>
      <p class="text-secondary mb-4">
        {{ community?.description }}
      </p>

    </div>

    <!-- Posts Header -->
    <div class="flex items-center justify-between mt-10 mb-5">
      <h2 class="text-2xl font-semibold text-primary">Posts</h2>

      <!-- Create Post Button -->
      <button
        class="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-transform transform hover:scale-105 duration-200 cursor-pointer"
        @click="goCreatePost"
      >
        Create Post
      </button>
    </div>

    <!-- Posts List -->
    <CommunityPostList
    :posts="communityPostStore.getByCommunity(Number(route.params.id))"
    @select="goPostDetail"
    />

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityStore } from '../../stores/communityStore.js'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'
import CommunityPostList from '../../components/communityPosts/CommunityPostList.vue'

const router = useRouter()
const route = useRoute()

const communityStore = useCommunityStore()
const communityPostStore = useCommunityPostStore()

const community = computed(() =>
  communityStore.communities.find(c => c.id === Number(route.params.id))
)

onMounted(async () => {
  await communityStore.fetchCommunities()
  await communityPostStore.fetchPosts(Number(route.params.id))
})

// Periksa route Create Post, pastikan sama dengan yang ada di router/index.js
function goCreatePost() {
  router.push(`/communities/${route.params.id}/posts/create`)
}

function goPostDetail(post) {
  router.push({
    name: 'CommunityPostDetail', // ganti dengan 'name' route yang benar
    params: { id: post.id }
  })
}
</script>
