<template>
<div class="max-w-5xl mx-auto py-10 px-4">

    <button
      class="flex items-center gap-2 text-primary font-medium mb-8 
             hover:text-primary-dark transition-all duration-200 
             transform hover:-translate-x-1" 
      @click="router.push('/communities')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to Communities
    </button>

    <div class="bg-white border border-blueLight rounded-2xl p-8 shadow-xl">

        <div class="flex items-start justify-between mb-4">
            <div>
                <h1 class="text-4xl font-bold text-black mb-1">
                    {{ community?.name }}
                </h1>
            </div>

            <div v-if="isOwner" class="relative z-20">
                <button 
                    @click.stop="showMenu = !showMenu" 
                    class="p-1 rounded-full text-gray-400 hover:text-primary transition-all"
                    title="Community actions"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
                
                <div 
                    v-if="showMenu" 
                    @mouseleave="showMenu = false" 
                    class="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                >
                    <button 
                        @click="goEdit(); showMenu = false" 
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        @click="showCommunityDeleteModal(); showMenu = false" 
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <p class="text-gray-600 whitespace-pre-line mb-2">
            {{ community?.description }}
        </p>
        <hr class="mt-6 border-gray-100"/>
    </div>


    <div class="flex items-center justify-between mt-12 mb-5">
        <h2 class="text-2xl font-bold text-black">Community Posts</h2>

        <button 
          class="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20 
                 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 cursor-pointer" 
          @click="goCreatePost"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Post
        </button>
    </div>

    <CommunityPostList 
      :posts="posts" 
      :currentUserId="authStore.user?.id"
      @select="goPostDetail"
      @edit="handleEditPost"
      @delete="showPostDeleteModal"
      class="mt-6"
    />


    <div v-if="posts.length === 0" class="text-center py-10 text-detail bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 mt-6">
      <p>No posts yet. Be the first to create one!</p>
    </div>

    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100 opacity-100">
        
        <h3 class="text-xl font-bold text-red-600 mb-4">
          {{ deleteType === 'community' ? 'Confirm Community Deletion' : 'Confirm Post Deletion' }}
        </h3>
        
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete <span class="font-semibold">{{ deleteType === 'community' ? deleteTarget?.name : deleteTarget?.title }}</span>? 
          <span v-if="deleteType === 'community'" class="font-bold text-red-500">This action cannot be undone and all posts will be lost.</span>
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            @click="executeDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue' 
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useCommunityStore } from '../../stores/communityStore.js'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'
import CommunityPostList from '../../components/communityPosts/CommunityPostList.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const communityStore = useCommunityStore()
const communityPostStore = useCommunityPostStore()

const showMenu = ref(false)

const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const deleteType = ref('')

function closeModal() {
    showDeleteModal.value = false
    deleteTarget.value = null
    deleteType.value = ''
}

onMounted(async () => {
    const communityId = Number(route.params.id);
    if (isNaN(communityId) || communityId <= 0) {
        alert("Invalid Community ID! Redirecting to communities.");
        router.push('/communities');
        return;
    }

    if (!communityStore.communities.length) {
        await communityStore.fetchCommunities()
    }
    await communityPostStore.fetchPosts(communityId)
})

const community = computed(() =>
    communityStore.communities.find(c => c.id === Number(route.params.id))
)

const posts = computed(() => 
    communityPostStore.getByCommunity(Number(route.params.id))
)

const isOwner = computed(() => {
    if (!authStore.user || !community.value) return false
    return authStore.user.id === community.value.user_id
})

function goEdit() {
    router.push(`/communities/${route.params.id}/edit`)
}

function showCommunityDeleteModal() {
    if (community.value) {
        deleteType.value = 'community'
        deleteTarget.value = community.value
        showDeleteModal.value = true
    }
}

async function executeDelete() {
    const type = deleteType.value;
    const target = deleteTarget.value;
    const communityId = Number(route.params.id); 

    closeModal(); 
    
    if (!target) {
        console.warn("Deletion target is missing.");
        return;
    }

    if (type === 'community') {
        try {
            await communityStore.deleteCommunity(communityId)
            // alert('Community successfully deleted.'); 
            router.push('/communities')
        } catch (error) {
            console.error("Error deleting community:", error)
            alert('Failed to delete community. Please try again.'); 
        }
    } else if (type === 'post') {
        try {
            await communityPostStore.deletePost(communityId, target.id);
            // alert(`Post "${target.title}" successfully deleted.`); 
            await communityPostStore.fetchPosts(communityId);
        } catch (error) {
            console.error("Error deleting post:", error);
            alert('Failed to delete post. Please try again.'); 
        }
    }
}

// === POST ACTIONS ===

function goCreatePost() {
    router.push(`/communities/${route.params.id}/posts/create`)
}

function goPostDetail(post) {
    const communityId = Number(route.params.id); 
    router.push({
        name: 'community-post-detail', 
        params: {
            communityId: communityId, 
            postId: post.id 
        }
    });
}

function handleEditPost(post) {
    const communityId = Number(route.params.id);
    router.push({
        name: 'community-post-edit',
        params: {
            communityId: communityId,
            postId: post.id
        }
    });
}

function showPostDeleteModal(post) {
    deleteType.value = 'post'
    deleteTarget.value = post
    showDeleteModal.value = true
}
</script>