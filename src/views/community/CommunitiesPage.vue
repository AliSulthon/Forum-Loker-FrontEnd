<template>
  <div class="max-w-6xl mx-auto py-10 px-4">

    <!-- Search & Create -->
    <div class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
      <!-- Search input -->
      <div class="relative w-full sm:max-w-lg flex-1">
        <input
          :value="communityStore.searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search communities by name or description..."
          class="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2" 
          stroke="currentColor" 
          class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      <!-- Create button -->
      <button
        class="group flex items-center gap-2 px-5 py-2 bg-white text-gray-500 border-2 border-primary rounded-xl font-semibold
               hover:bg-primary hover:text-white transition-transform transform hover:scale-105 
               duration-200 cursor-pointer whitespace-nowrap"
        @click="goCreate"
      >
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

    <!-- Full-width Toggle Filter -->
    <div class="flex w-full border border-primary rounded-xl overflow-hidden mb-6">
      <button
        :class="['flex-1 px-4 py-2 font-semibold transition text-center', ownerFilter === 'all' ? 'bg-primary text-white' : 'bg-white text-primary']"
        @click="ownerFilter = 'all'"
      >
        Semua
      </button>
      <button
        :class="['flex-1 px-4 py-2 font-semibold transition text-center', ownerFilter === 'mine' ? 'bg-primary text-white' : 'bg-white text-primary']"
        @click="ownerFilter = 'mine'"
      >
        Milik Saya
      </button>
    </div>

    <!-- Community list -->
    <CommunityList :communities="filteredCommunities" @select="goDetail" /> 

    <!-- Empty state -->
    <div v-if="communityStore.loaded && filteredCommunities.length === 0" class="text-center py-10 text-secondary">
      <p v-if="communityStore.searchQuery">No communities found matching "{{ communityStore.searchQuery }}".</p>
      <p v-else>No communities available yet. Create the first one!</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommunityStore } from '../../stores/communityStore.js'
import CommunityList from '../../components/community/CommunityList.vue'

const router = useRouter()
const communityStore = useCommunityStore()

// Filter toggle: all / mine
const ownerFilter = ref('all')

// Computed filtered communities: search + owner filter
const filteredCommunities = computed(() => {
  let list = communityStore.filteredCommunities

  if (ownerFilter.value === 'mine') {
    list = list.filter(c => c.isOwner)
  }

  return list
})

// Fetch communities saat component mount
onMounted(() => {
  if (!communityStore.loaded) {
    communityStore.fetchCommunities()
  }
})

// Fungsi search
function handleSearch(event) {
  communityStore.setSearchQuery(event.target.value)
}

// Navigate
function goDetail(item) {
  router.push('/communities/' + item.id)
}

function goCreate() {
  router.push('/communities/create')
}
</script>
