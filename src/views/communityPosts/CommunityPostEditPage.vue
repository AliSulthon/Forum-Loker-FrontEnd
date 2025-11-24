<template>
  <div class="max-w-3xl mx-auto py-10 px-4">

    <button class="text-primary mb-6" @click="router.back()">← Back</button>

    <h1 class="text-4xl font-bold mb-6">Edit Post</h1>

    <div class="bg-white border rounded-xl p-6">
      <!-- hanya muncul kalau post sudah ada -->
      <CommunityPostForm
        v-if="post"
        :initialData="post"
        @submit="handleSubmit"
      />

      <p v-else>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore'
import CommunityPostForm from '../../components/communityPosts/CommunityPostForm.vue'

const router = useRouter()
const route = useRoute()
const postStore = useCommunityPostStore()

const communityId = route.params.id || route.query.community
const postId = Number(route.params.id)

// Ambil post secara reaktif lewat getter
const post = computed(() => 
  postStore.getByCommunity(communityId)?.find(p => p.id === postId)
)

onMounted(async () => {
  // Fetch posts dulu
  await postStore.fetchPosts(communityId)
})

function handleSubmit(data) {
  postStore.updatePost(communityId, postId, data)
  router.push("/communities/" + communityId)
}
</script>
