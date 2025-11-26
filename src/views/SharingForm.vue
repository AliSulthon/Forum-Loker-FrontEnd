<template>
  <div class="min-h-screen bg-gray-50 relative font-sans">
    
    <div class="fixed inset-0 z-0 opacity-40 pointer-events-none" 
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-4 py-10">
      
      <button @click="$router.back()" class="flex items-center gap-2 text-detail font-bold hover:text-blueHeadline mb-6 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back
      </button>

      <div class="bg-white rounded-[30px] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        
        <div class="mb-8 border-b border-gray-100 pb-6">
          <h1 class="font-namaApp text-3xl font-bold text-headline">
            {{ isEditing ? 'Edit Post' : 'Create New information Post' }}
          </h1>
          <p class="text-detail mt-2">Share your thoughts with the community.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-500 uppercase tracking-wider">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="What's the topic?" 
              class="w-full px-5 py-4 text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all placeholder-gray-400"
              required
            />
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-500 uppercase tracking-wider">Content</label>
            <textarea 
              v-model="form.content" 
              rows="12" 
              placeholder="Write your information here..." 
              class="w-full px-5 py-4 text-base leading-relaxed text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all resize-none placeholder-gray-400"
              required
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              @click="$router.back()" 
              class="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-8 py-3 rounded-xl bg-blueHeadline text-white font-bold shadow-lg shadow-blueHeadline/30 hover:bg-bluePrimary hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Saving...' : 'Publish Post' }}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const API_URL = "http://localhost:8000/api"

const form = reactive({ title: "", content: "" })
const isSubmitting = ref(false)

// Cek apakah mode Edit (ada ID di URL)
const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  // Jika ada ID di URL, berarti sedang Edit -> Ambil data lama
  if (isEditing.value) {
    try {
      const token = localStorage.getItem("auth_token")
      const res = await axios.get(`${API_URL}/sharing/${route.params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      form.title = res.data.data.title
      form.content = res.data.data.content
    } catch (error) {
      alert("Gagal mengambil data post.")
      router.push('/sharing')
    }
  }
})

async function handleSubmit() {
  isSubmitting.value = true
  const token = localStorage.getItem("auth_token")

  try {
    if (isEditing.value) {
      // UPDATE
      await axios.put(`${API_URL}/sharing/${route.params.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } else {
      // CREATE
      await axios.post(`${API_URL}/sharing`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    // Sukses -> Kembali ke feed
    router.push('/sharing')
  } catch (error) {
    alert(error.response?.data?.message || "Terjadi kesalahan.")
  } finally {
    isSubmitting.value = false
  }
}
</script>