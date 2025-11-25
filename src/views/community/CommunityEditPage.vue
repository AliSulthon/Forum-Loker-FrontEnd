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
    <h1 class="text-4xl font-bold text-primary mb-6">Edit Community</h1>

    <div class="bg-white border border-primary rounded-xl p-6 shadow-sm hover:shadow-md">
      <!-- tampil form jika community sudah siap -->
      <CommunityForm
        v-if="community"
        :initialData="community"
        @submit="handleSubmit"
      />

      <p v-else>Loading...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityStore } from '../../stores/communityStore'
import CommunityForm from '../../components/community/CommunityForm.vue'

const router = useRouter()
const route = useRoute()
const communityStore = useCommunityStore()

const communityId = Number(route.params.id) // asumsi route: /communities/:id/edit

const community = ref(null)

onMounted(async () => {
  try {
    community.value = await communityStore.fetchCommunityById(communityId)

    if (!community.value) {
      alert("Community tidak ditemukan")
      router.push("/communities")
    }
  } catch (error) {
    console.error("Failed to fetch community:", error)
    alert("Gagal memuat data community")
    router.push("/communities")
  }
})

function handleSubmit(data) {
  communityStore.updateCommunity(communityId, data)
  router.push(`/communities/${communityId}`)
}
</script>
