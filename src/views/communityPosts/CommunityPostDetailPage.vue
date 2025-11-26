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
      Back to Community
    </button>

    <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
      
      <div v-if="isLoading || !post" class="text-center py-10 text-secondary flex flex-col items-center">
        <svg v-if="isLoading" class="animate-spin h-6 w-6 text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p v-else>Post not found or loading...</p>
      </div>

      <div v-else>
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-3xl font-bold text-black pr-4">
            {{ post.title }}
          </h1>

          <div v-if="isOwner" class="relative z-10">
            <button 
                @click.stop="showMenu = !showMenu" 
                class="p-1 rounded-full text-gray-400 hover:text-primary transition-all"
                title="Post actions"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            
            <div 
                v-if="showMenu" 
                @click.stop
                @mouseleave="showMenu = false"
                class="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden"
            >
                <button 
                    @click="goEdit(); showMenu = false" 
                    class="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.75" /></svg>
                    Edit
                </button>
                <button 
                    @click="confirmDelete(); showMenu = false" 
                    class="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .5m5.716 0h.008v.008h-.008v-.008zm1.875 0h.008v.008h-.008v-.008z" /></svg>
                    Delete
                </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 border-b border-gray-100 pb-4 mb-5">
            <RouterLink 
              v-if="post.user" 
              :to="{ name: 'user-profile', params: { id: post.user_id } }"
              class="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow">
                {{ post.user?.name?.charAt(0).toUpperCase() || post.user?.username?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div>
                <p class="font-semibold text-black">{{ post.user?.name || post.user?.username || authorName }}</p>
                <p class="text-xs text-gray-500">@{{ post.user?.username || 'user' }}</p>
              </div>
            </RouterLink>
            <span class="text-gray-400">•</span>
            <p class="text-sm text-gray-500">
                {{ formattedDate }}
            </p>
        </div>

        <div class="text-base text-black whitespace-pre-line">
            {{ post.content }}
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore'
import { useAuthStore } from '../../stores/auth' // Perlu untuk cek isOwner

const router = useRouter()
const route = useRoute()
const postStore = useCommunityPostStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const showMenu = ref(false) // Untuk kontrol dropdown
const post = ref(null)

// Ambil ID dari route
const communityId = computed(() => Number(route.params.communityId || route.params.id))
const postId = computed(() => Number(route.params.postId))

// KODE PENTING: Fetch data saat mount dan validasi ID
onMounted(async () => {
  if (!communityId.value || isNaN(communityId.value) || !postId.value || isNaN(postId.value)) {
    alert("Invalid Post or Community ID! Redirecting to home.");
    router.push('/');
    return;
  }
  
  try {
    isLoading.value = true;
    // Panggil fetch posts untuk memastikan data post ada di store
    await postStore.fetchPosts(communityId.value);
    
    // Ambil post secara spesifik
    post.value = postStore.getById(communityId.value, postId.value);

    if (!post.value) {
        alert("Post not found!");
        router.push('/communities/' + communityId.value);
    }

  } catch (error) {
    console.error("Error fetching post details:", error);
    alert('Failed to load post details.');
  } finally {
    isLoading.value = false;
  }
});


// Properti Terhitung (Computed Properties)

const isOwner = computed(() => {
  if (!authStore.user || !post.value) return false;
  return authStore.user.id === post.value.user_id;
});

const authorName = computed(() => {
    return post.value?.user?.username || `User ID ${post.value?.user_id}`; 
});

const formattedDate = computed(() => {
    if (!post.value?.created_at) return "";
    try {
        const d = new Date(post.value.created_at);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    } catch (error) {
        return "";
    }
});


// === ACTIONS ===

function goEdit() {
  router.push(`/communities/${communityId.value}/posts/${postId.value}/edit`);
}

function confirmDelete() {
  if (confirm(`Are you sure you want to delete the post "${post.value.title}"?`)) {
    deletePost();
  }
}

async function deletePost() {
  try {
    await postStore.deletePost(communityId.value, postId.value);
    // Kembali ke detail komunitas setelah penghapusan berhasil
    router.push('/communities/' + communityId.value);
  } catch (error) {
    console.error("Error deleting post:", error);
    alert('Failed to delete post. Please try again.');
  }
}
</script>