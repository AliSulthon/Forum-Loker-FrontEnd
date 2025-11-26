<template>
  <div class="min-h-screen max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8"> 

    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
      <div>
        <h1 class="font-namaApp text-4xl font-black text-primary tracking-tight mb-2">
          <span class="text-black">Community</span> <span class="text-primary-light">Hub</span>
        </h1>
        <p class="text-detail font-medium max-w-xl">
          Find and join communities that interest you.
        </p>
      </div>

      <button 
        @click="goCreate"
        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Create Community
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-1">

      <div class="flex items-center gap-2">
        <button 
          @click="ownerFilter = 'all'"
          :class="[
            'px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2',
            ownerFilter === 'all' 
              ? 'border-primary text-primary bg-primary-light/10' 
              : 'border-transparent text-gray-500 hover:text-primary hover:bg-gray-50'
          ]"
        >
          All
        </button>
        <button 
          @click="ownerFilter = 'mine'"
          :class="[
            'px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2',
            ownerFilter === 'mine' 
              ? 'border-primary text-primary bg-primary-light/10' 
              : 'border-transparent text-gray-500 hover:text-primary hover:bg-gray-50'
          ]"
        >
          My Communities
        </button>
      </div>

      <div class="relative w-full md:w-64 mb-2 md:mb-0">
        <input 
          :value="communityStore.searchQuery"
          @input="handleSearch"
          type="text" 
          placeholder="Search communities..." 
          class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
        >
        <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <CommunityList 
      v-if="communityStore.loaded && filteredCommunities.length > 0"
      :communities="filteredCommunities" 
      @select="goDetail" 
    /> 

    <div v-else-if="communityStore.loaded && filteredCommunities.length === 0" class="text-center py-10 text-secondary bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100">
      <p v-if="communityStore.searchQuery">No communities found matching "{{ communityStore.searchQuery }}".</p>
      <p v-else>No communities available yet. Be the first to create one!</p>
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