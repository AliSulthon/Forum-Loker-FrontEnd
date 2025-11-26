<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
        <p class="font-bold text-lg mb-2">User Not Found</p>
        <p>{{ error }}</p>
        <button @click="$router.back()" class="mt-4 text-blue-600 hover:underline">← Go Back</button>
      </div>

      <!-- Profile Content -->
      <div v-else-if="user" class="space-y-6">
        <!-- Profile Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Header Background -->
          <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <!-- Profile Info -->
          <div class="px-8 pb-8">
            <!-- Avatar -->
            <div class="flex items-end justify-between -mt-16 mb-6">
              <div class="relative">
                <div v-if="user.photo_url" class="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  <img :src="user.photo_url" :alt="user.name" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span class="text-4xl font-bold text-white">{{ getInitials(user.name) }}</span>
                </div>
              </div>
            </div>

            <!-- Name & Username -->
            <div class="mb-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-1">{{ user.name }}</h1>
              <p class="text-lg text-gray-500">@{{ user.username }}</p>
            </div>

            <!-- Bio -->
            <div v-if="user.bio" class="mb-6">
              <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</h3>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ user.bio }}</p>
            </div>
            <div v-else class="mb-6">
              <p class="text-gray-400 italic">No bio yet</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ user.posts_count || 0 }}</p>
                <p class="text-sm text-gray-500">Posts</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ user.articles_count || 0 }}</p>
                <p class="text-sm text-gray-500">Articles</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ user.sharings_count || 0 }}</p>
                <p class="text-sm text-gray-500">Sharings</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info (optional) -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
          <div class="space-y-3">
            <div v-if="user.email" class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span class="text-gray-700">{{ user.email }}</span>
            </div>
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span class="text-gray-700">Joined {{ formatDate(user.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const user = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    loading.value = true;
    const userId = route.params.id;
    const response = await api.get(`/users/${userId}`);
    user.value = response.data.data || response.data;
    
    console.log('User profile loaded:', user.value);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    error.value = err.response?.status === 404 
      ? 'User not found' 
      : 'Failed to load user profile';
  } finally {
    loading.value = false;
  }
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

// Format date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchUserProfile();
});
</script>
