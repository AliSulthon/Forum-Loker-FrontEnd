<template>
  <div class="max-w-6xl mx-auto py-10 px-4">

    <div class="flex items-center justify-end mb-8">
      <!-- <h1 class="text-primary text-4xl font-bold">Communities</h1> -->

      <button
  class="group flex items-center gap-2 px-5 py-2 bg-white text-gray-500 border-2 border-primary rounded-xl font-semibold
         hover:bg-primary hover:text-white transition-transform transform hover:scale-105 
         duration-200 cursor-pointer"
  @click="goCreate"
>
  <!-- Icon Plus -->
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke-width="2" 
    stroke="currentColor" 
    class="w-5 h-5 text-primary group-hover:text-white transition"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>

  Create Community
</button>
    </div>

    <CommunityList :communities="communityStore.communities" @select="goDetail" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../../stores/communityStore.js'
import CommunityList from '../../components/community/CommunityList.vue'

const router = useRouter()
const communityStore = useCommunityStore()

// Panggil fetch saat component mount
onMounted(() => {
  communityStore.fetchCommunities()
})

function goDetail(item) {
  router.push('/communities/' + item.id)
}

function goCreate() {
  router.push('/communities/create')
}
</script>

