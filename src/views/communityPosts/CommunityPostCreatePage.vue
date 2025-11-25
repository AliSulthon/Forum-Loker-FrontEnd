<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <!-- Back Button -->
    <button
      class="flex items-center gap-2 text-primary font-medium mb-6 hover:text-primary-light transition"
      @click="router.push('/communities/' + route.params.id)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <h1 class="text-4xl font-bold text-primary mb-6">Create New Post</h1>

    <div class="bg-white border border-primary rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <CommunityPostForm @submit="handleSubmit" :isLoading="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'
import CommunityPostForm from '../../components/communityPosts/CommunityPostForm.vue'

const router = useRouter()
const route = useRoute()
const postStore = useCommunityPostStore()

const isLoading = ref(false)

async function handleSubmit(data) {
  const communityId = Number(route.params.id)
  if (!communityId) { alert("Community ID tidak ditemukan!"); return }

  try {
    isLoading.value = true
    await postStore.addPost(communityId, data.title, data.content)
    router.push('/communities/' + communityId)
  } catch (error) {
    console.error(error)
    alert('Failed to create post. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>
