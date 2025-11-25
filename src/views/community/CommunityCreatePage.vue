<template>
  <div class="max-w-3xl mx-auto py-10 px-4">

    <!-- Back Button -->
    <button
      class="flex items-center gap-2 text-primary font-medium mb-6 hover:text-primary-light transition"
      @click="router.back()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <!-- Page Title -->
    <h1 class="text-4xl font-bold text-primary mb-6">
      Create New Community
    </h1>

    <!-- Community Form -->
    <CommunityForm 
      @submit="handleSubmit" 
      class="bg-white border border-primary rounded-xl p-6 shadow-sm hover:shadow-md"
    />
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../../stores/communityStore.js'
import CommunityForm from '../../components/community/CommunityForm.vue'

const router = useRouter()
const communityStore = useCommunityStore()

async function handleSubmit(data) {
  await communityStore.addCommunity(data)
  router.push('/communities')
}
</script>
