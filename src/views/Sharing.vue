<template>
  <div class="min-h-screen bg-gray-50 relative font-sans overflow-x-hidden">
    
    <div class="fixed inset-0 z-0 opacity-40 pointer-events-none" 
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 class="font-namaApp text-4xl font-black text-headline tracking-tight mb-2">
            Sharing <span class="text-blueHeadline">Corner</span>
          </h1>
          <p class="text-detail font-medium max-w-xl">
            Discover the latest insights from the Sevanta community.
          </p>
        </div>
        
        <button 
          @click="openModal('create')"
          class="flex items-center gap-2 px-6 py-3 rounded-xl bg-blueHeadline text-white font-bold shadow-lg shadow-blueHeadline/30 hover:bg-bluePrimary hover:-translate-y-1 transition-all duration-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Create Post
        </button>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-1">
        
        <div class="flex items-center gap-2">
          <button 
            @click="activeTab = 'all'"
            :class="[
              'px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2',
              activeTab === 'all' 
                ? 'border-blueHeadline text-blueHeadline bg-blue-50/50' 
                : 'border-transparent text-gray-500 hover:text-headline hover:bg-gray-50'
            ]"
          >
            Explore
          </button>
          <button 
            @click="activeTab = 'my'"
            :class="[
              'px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2',
              activeTab === 'my' 
                ? 'border-blueHeadline text-blueHeadline bg-blue-50/50' 
                : 'border-transparent text-gray-500 hover:text-headline hover:bg-gray-50'
            ]"
          >
            My Posts
          </button>
        </div>

        <div class="relative w-full md:w-64 mb-2 md:mb-0">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search topics..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:border-transparent transition-all shadow-sm"
          >
          <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

      </div>

      <div v-if="errorState.show" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex justify-between items-center">
        <span>{{ errorState.message }}</span>
        <button @click="errorState.show = false">&times;</button>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-white rounded-[24px] h-72 animate-pulse border border-gray-100"></div>
      </div>

      <div v-else-if="filteredSharings.length === 0" class="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[30px] border border-white">
        <div class="inline-block p-4 rounded-full bg-blue-50 mb-4">
          <svg class="w-10 h-10 text-blueHeadline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-headline mb-2">
          {{ activeTab === 'my' ? "You haven't posted anything yet." : "No content available." }}
        </h3>
        <p v-if="activeTab === 'my'" class="text-detail">Start sharing your ideas now!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div 
          v-for="item in filteredSharings" 
          :key="item.id"
          class="group bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blueHeadline/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blueHeadline to-bluePrimary flex items-center justify-center text-white font-bold text-sm shadow-md">
                   {{ getInitials(item.user?.fullname) }}
                </div>
                <div>
                  <p class="text-sm font-bold text-headline leading-tight">{{ item.user?.fullname }}</p>
                  <p class="text-xs text-detail">{{ formatDate(item.created_at) }}</p>
                </div>
              </div>
              
              <div v-if="isOwner(item.user_id)" class="relative z-20">
                 <button @click.prevent="item.showMenu = !item.showMenu" class="text-gray-300 hover:text-blueHeadline p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                 </button>
                 <div v-if="item.showMenu" @mouseleave="item.showMenu = false" class="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <button @click="openModal('edit', item)" class="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Edit</button>
                    <button @click="deleteSharing(item.id)" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Delete</button>
                 </div>
              </div>
            </div>

            <router-link :to="{ name: 'SharingDetail', params: { id: item.id } }" class="block group-hover:opacity-100">
              <h3 class="text-lg font-bold text-headline mb-2 line-clamp-2 group-hover:text-blueHeadline transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-detail text-sm leading-relaxed mb-6 line-clamp-3">
                {{ item.content }}
              </p>
            </router-link>
          </div>

          <div class="pt-4 border-t border-gray-50 flex justify-between items-center">
            
            <div class="flex items-center gap-1 text-detail text-xs font-bold" title="Likes">
                <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                <span>{{ item.likes_count || 0 }}</span>
            </div>

            <router-link 
              :to="{ name: 'SharingDetail', params: { id: item.id } }" 
              class="text-xs font-bold text-blueHeadline hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
            >
              Read More
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
       <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
       <div class="bg-white w-full max-w-lg rounded-[30px] shadow-2xl z-10 p-8 relative overflow-hidden">
          <h2 class="text-2xl font-bold font-namaApp mb-6">{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>
          <form @submit.prevent="handleSubmit">
             <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Title</label>
                  <input v-model="form.title" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline" required placeholder="Enter title..." />
                </div>
                <div>
                   <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Content</label>
                   <textarea v-model="form.content" rows="4" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline" required placeholder="Write something..."></textarea>
                </div>
             </div>
             <div class="flex gap-3 mt-6">
                <button type="button" @click="closeModal" class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-detail hover:bg-gray-50">Cancel</button>
                <button type="submit" :disabled="isSubmitting" class="flex-1 py-3 bg-blueHeadline text-white rounded-xl font-bold hover:bg-bluePrimary disabled:opacity-70">
                   {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
             </div>
          </form>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue"
import { useRouter } from "vue-router" 
import { useAuthStore } from "@/stores/auth" 
import api from "@/services/api" 

const router = useRouter() 
const authStore = useAuthStore()

const sharings = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentId = ref(null)
const activeTab = ref('all')
const searchQuery = ref("")
const loggedInUserId = computed(() => authStore.user?.id)
const currentUser = computed(() => authStore.user)

const errorState = reactive({ show: false, message: "" })
const form = reactive({ title: "", content: "" })

// Computed Filter
const filteredSharings = computed(() => {
  let result = sharings.value

  // Filter A: Berdasarkan Tab (My Posts vs All)
  if (activeTab.value === 'my') {
    result = result.filter(item => item.user_id === loggedInUserId.value)
  }

  // Filter B: Berdasarkan Search Query (Title atau Content)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query) ||
      item.user?.fullname.toLowerCase().includes(query) 
    )
  }

  return result
})

function getInitials(name) { 
  return name ? name.charAt(0).toUpperCase() : '?' 
}

function formatDate(date) { 
  return new Date(date).toLocaleDateString('id-ID', { 
    year:'numeric', 
    month:'short', 
    day:'numeric' 
  }) 
}

function isOwner(userId) { 
  return loggedInUserId.value === userId 
}

async function fetchSharings() {
  isLoading.value = true
  
  // ✅ Load auth dari store
  authStore.loadFromStorage()
  
  try {
    //api instance (token sudah auto di interceptor)
    const response = await api.get('/sharing')
    sharings.value = response.data.data.map(item => ({ 
      ...item, 
      showMenu: false 
    }))
  } catch (error) {
    console.error('Fetch sharings error:', error)
    
    // Handle 401
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    } else if (error.response?.status !== 404) {
      errorState.show = true
      errorState.message = "Gagal memuat data."
    }
  } finally {
    isLoading.value = false
  }
}

function openModal(type, item = null) {
  // CEK AUTH sebelum create/edit
  if (!authStore.isAuthenticated) {
    alert("Silakan login terlebih dahulu!")
    router.push('/login')
    return
  }
  
  showModal.value = true
  if (type === 'edit' && item) {
    isEditing.value = true
    currentId.value = item.id
    form.title = item.title
    form.content = item.content
    item.showMenu = false
  } else {
    isEditing.value = false
    currentId.value = null
    form.title = ""
    form.content = ""
  }
}

function closeModal() { 
  showModal.value = false 
}

async function handleSubmit() {
  // Double check auth
  if (!authStore.isAuthenticated) {
    alert("Sesi Anda telah berakhir. Silakan login kembali.")
    authStore.logout()
    router.push('/login')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Api instance
    if (isEditing.value) {
      await api.put(`/sharing/${currentId.value}`, form)
    } else {
      await api.post('/sharing', form)
    }
    closeModal()
    fetchSharings()
  } catch (error) {
    console.error('Submit error:', error)
    
    // Handle 401
    if (error.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.")
      authStore.logout()
      router.push('/login')
    } else {
      alert(error.response?.data?.message || "Terjadi kesalahan.")
    }
  } finally {
    isSubmitting.value = false
  }
}

async function deleteSharing(id) {
  if (!confirm("Hapus post ini?")) return
  
  // Check auth
  if (!authStore.isAuthenticated) {
    alert("Silakan login terlebih dahulu!")
    router.push('/login')
    return
  }
  
  try {
    // api instance
    await api.delete(`/sharing/${id}`)
    fetchSharings()
  } catch(error) { 
    console.error('Delete error:', error)
    
    // Handle 401
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    } else {
      alert("Gagal hapus")
    }
  }
}
//Debug
onMounted(() => {
  console.log('=== DEBUG INFO (Sharing.vue) ===')
  console.log('Auth Store Token:', authStore.token)
  console.log('Auth Store User:', authStore.user?.name)
  console.log('Is Authenticated:', authStore.isAuthenticated)
  console.log('================================')
  
  // Load auth dan fetch data
  authStore.loadFromStorage()
  fetchSharings()
})
</script>
