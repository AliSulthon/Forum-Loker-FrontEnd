<template>
  <div class="max-w-3xl mx-auto py-10 px-4">

    <button
      class="flex items-center gap-2 text-primary font-medium mb-8 
             hover:text-primary-dark transition-all duration-200 
             transform hover:-translate-x-1"
      @click="router.push('/communities/' + communityId)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back
    </button>

    <h1 class="text-4xl font-bold text-black mb-6">Edit Post</h1>

    <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
      
      <div v-if="!post" class="text-center py-10 text-secondary flex flex-col items-center">
        <svg class="animate-spin h-6 w-6 text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading post data...</p>
      </div>
      
      <CommunityPostForm
        v-else
        :key="post.id"
        :initialData="post"
        :isLoading="isLoading"
        @submit="handleSubmit"
      />
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
  // Fetch posts dan set data ke ref post
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
    // Redirect kembali ke detail komunitas setelah berhasil
    router.push('/communities/' + communityId.value)
  } catch (error) {
    console.error(error)
    alert('Failed to update post. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>