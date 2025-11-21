<template>
  <div class="max-w-4xl mx-auto py-10 px-4">

    <button
      class="text-indigo-600 font-medium mb-6 hover:underline"
      @click="router.back()"
    >
      ← Back
    </button>

    <div class="bg-white rounded-xl border p-8 shadow-sm">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        {{ post?.title }}
      </h1>

      <p class="text-gray-600 leading-relaxed mb-6">
        {{ post?.content }}
      </p>

      <div class="text-sm text-gray-500 flex justify-between">
        <span>{{ post?.author }}</span>
        <span>{{ post?.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityPostStore } from '../../stores/communityPostStore.js'

const router = useRouter()
const route = useRoute()

const postStore = useCommunityPostStore()

const post = computed(() =>
  postStore.posts.find(p => p.id === Number(route.params.id))
)

onMounted(() => {
  if (!post.value) {
    postStore.fetchSinglePost(route.params.id)
  }
})
</script>
