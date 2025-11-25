<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <!-- Back Button -->
    <button 
      class="flex items-center gap-2 text-primary font-medium mb-6 hover:text-primary-light transition"
      @click="router.push('/communities/' + communityId)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <h1 class="text-4xl font-bold text-primary mb-6">Edit Post</h1>

    <div class="bg-white border border-primary rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <CommunityPostForm
        v-if="post"
        :key="post.id"
        :initialData="post"
        :isLoading="isLoading"
        @submit="handleSubmit"
      />
      <div v-else class="text-center py-10 text-secondary">
        <p>Loading post...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore'
import CommunityPostForm from '../../components/communityPosts/CommunityPostForm.vue'

const router = useRouter()
const route = useRoute()
const postStore = useCommunityPostStore()

const isLoading = ref(false)
const communityId = computed(() => Number(route.params.id))
const postId = computed(() => Number(route.params.postId))
const post = ref(null)

onMounted(async () => {
  await postStore.fetchPosts(communityId.value)
  post.value = postStore.getById(communityId.value, postId.value)
})

async function handleSubmit(data) {
  try {
    isLoading.value = true
    await postStore.updatePost(communityId.value, postId.value, {
      title: data.title,
      content: data.content
    })
    router.push('/communities/' + communityId.value)
  } catch (error) {
    console.error(error)
    alert('Failed to update post. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>
