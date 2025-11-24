<template>
<div class="max-w-5xl mx-auto py-10 px-4">

    <!-- Back Button -->
    <button class="text-primary hover:text-primary-light font-medium mb-6" @click="router.push('/communities')">
        ← Back
    </button>

    <!-- Community Card -->
    <div class="bg-white border border-primary rounded-xl p-8 shadow-sm hover:shadow-md">

        <div class="flex items-center justify-between mb-3">
            <h1 class="text-3xl font-bold text-primary">
                {{ community?.name }}
            </h1>

            <!-- OWNER ONLY ACTIONS -->
            <div v-if="isOwner" class="flex items-center gap-3">
                <!-- Edit -->
                <button class="px-4 py-1.5 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition" @click="goEdit">
                    Edit
                </button>

                <!-- Delete -->
                <button class="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-400 transition" @click="confirmDelete">
                    Delete
                </button>
            </div>
        </div>

        <p class="text-secondary mb-4">
            {{ community?.description }}
        </p>
    </div>

    <!-- Posts Header -->
    <div class="flex items-center justify-between mt-10 mb-5">
        <h2 class="text-2xl font-semibold text-primary">Posts</h2>

        <!-- Create Post Button -->
        <button class="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-transform transform hover:scale-105 duration-200 cursor-pointer" @click="goCreatePost">
            Create Post
        </button>
    </div>

    <!-- Posts List -->
    <CommunityPostList 
      :posts="posts" 
      :currentUserId="authStore.user?.id"
      @select="goPostDetail"
      @edit="handleEditPost"
      @delete="handleDeletePost"
    />

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-10 text-secondary">
      <p>No posts yet. Be the first to create one!</p>
    </div>

</div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
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

onMounted(async () => {
  await communityStore.fetchCommunities()
  await communityPostStore.fetchPosts(Number(route.params.id))
})

const community = computed(() =>
  communityStore.communities.find(c => c.id === Number(route.params.id))
)

const posts = computed(() => 
  communityPostStore.getByCommunity(Number(route.params.id))
)

// cek apakah user adalah owner
const isOwner = computed(() => {
  if (!authStore.user || !community.value) return false
  return authStore.user.id === community.value.user_id
})

function goEdit() {
  router.push(`/communities/${route.params.id}/edit`)
}

function confirmDelete() {
  if (confirm("Are you sure you want to delete this community?")) {
    deleteCommunity()
  }
}

async function deleteCommunity() {
  await communityStore.deleteCommunity(Number(route.params.id))
  router.push('/communities')
}

function goCreatePost() {
  router.push(`/communities/${route.params.id}/posts/create`)
}

function goPostDetail(post) {
  router.push({
    name: 'CommunityPostDetail',
    params: { id: post.id }
  })
}

function handleEditPost(post) {
  // community id tetap dari route
  const communityId = Number(route.params.id);
  router.push(`/communities/${communityId}/posts/${post.id}/edit`);
}


async function handleDeletePost(post) {
  const communityId = Number(route.params.id);

  if (confirm("Are you sure you want to delete this post?")) {
    communityPostStore.deletePost(communityId, post.id);
    // refresh agar UI update
    await communityPostStore.fetchPosts(communityId);
  }
}


</script>