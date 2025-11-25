<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blueHeadline to-bluePrimary text-white py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-black font-namaApp mb-6 tracking-tight">
          Welcome to Sevanta
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Your ultimate platform for job opportunities, career development, and professional networking
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink 
            v-if="!isLoggedIn"
            to="/register" 
            class="px-8 py-4 bg-white text-blueHeadline font-bold rounded-xl text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started
          </RouterLink>
          <RouterLink 
            to="/articles" 
            class="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl text-lg hover:bg-white hover:text-blueHeadline transition-all duration-300"
          >
            Explore Articles
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-headline font-namaApp text-center mb-12">
          Why Choose Sevanta?
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blueLight rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blueHeadline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-headline mb-3">Job Opportunities</h3>
            <p class="text-detail">
              Discover the latest job postings from top companies across various industries
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blueLight rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blueHeadline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-headline mb-3">Career Articles</h3>
            <p class="text-detail">
              Read expert articles on career development, interview tips, and professional growth
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blueLight rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blueHeadline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-headline mb-3">Community</h3>
            <p class="text-detail">
              Connect with professionals, share experiences, and build your network
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="!isLoggedIn" class="py-16 px-4 bg-gradient-to-r from-blueHeadline/10 to-bluePrimary/10">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-headline font-namaApp mb-6">
          Ready to Advance Your Career?
        </h2>
        <p class="text-lg text-detail mb-8">
          Join thousands of professionals who trust Sevanta for their career growth
        </p>
        <RouterLink 
          to="/register" 
          class="inline-block px-10 py-4 bg-blueHeadline text-white font-bold rounded-xl text-lg hover:bg-bluePrimary hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Sign Up Now
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.token);
</script>
