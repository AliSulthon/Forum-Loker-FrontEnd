<template>
  <div class="max-w-3xl mx-auto py-10 px-4">

    <!-- Back Button -->
    <button
      class="text-primary font-medium mb-6 hover:text-primary-light transition"
      @click="router.push('/communities/' + route.params.id)"
    >
      ← Back
    </button>

    <!-- Page Title -->
    <h1 class="text-4xl font-bold text-primary mb-6">
      Create New Post
    </h1>

    <!-- Post Form Container -->
    <div class="bg-white border border-primary rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <CommunityPostForm @submit="handleSubmit" />
    </div>
    
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'
import CommunityPostForm from '../../components/communityPosts/CommunityPostForm.vue'

const router = useRouter()
const route = useRoute()
const postStore = useCommunityPostStore()

async function handleSubmit(data) {
  // Ambil id dari route params dulu, fallback ke query
  const communityId = route.params.id || route.query.community
  if (!communityId) {
    console.error("Community ID tidak ditemukan!")
    return
  }

  await postStore.addPost({
    ...data,
    community_id: Number(communityId),
    author: 'You',
    date: new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  router.push('/communities/' + communityId)
}

</script>
