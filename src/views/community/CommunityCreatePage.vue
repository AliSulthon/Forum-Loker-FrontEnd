<template>
  <div class="max-w-3xl mx-auto py-10 px-4">

    <button
      class="flex items-center gap-2 text-primary font-medium mb-6 
             hover:text-primary-dark transition-all duration-200 
             transform hover:-translate-x-1" 
      @click="router.back()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back
    </button>

    <h1 class="text-4xl font-bold text-black mb-6">
      Create New Community
    </h1>

    <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
      <CommunityForm 
        @submit="handleSubmit" 
      />
    </div>
    
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