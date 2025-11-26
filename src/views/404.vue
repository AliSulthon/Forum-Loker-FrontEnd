<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    
    <h1 class="text-9xl font-extrabold text-primary-dark tracking-widest mb-4">
      404
    </h1>

    <div class="bg-red-500 text-white px-3 py-1 text-sm rounded-lg rotate-6 absolute top-1/4 shadow-md">
      PAGE NOT FOUND
    </div>
    
    <p class="text-xl text-gray-700 mt-5 mb-8 text-center max-w-md">
      Oops! We couldn't find the page you're looking for. It might be a typo in the address, or the page may have been moved.
    </p>

    <router-link 
      to="/"
      class="relative inline-block text-sm font-medium text-white group focus:outline-none focus:ring z-10"
    >
      <span
        class="absolute inset-0 border border-primary group-active:border-primary-dark transition-all duration-300 transform group-hover:-translate-x-1 group-hover:-translate-y-1"
      ></span>
      <span
        class="block px-8 py-3 bg-primary transition-all duration-300 border border-primary group-hover:bg-primary-dark group-active:bg-primary-dark"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 inline-block align-text-bottom mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.44.75-.787 1.054-1.054a1.8 1.8 0 012.753 0c.304.267.614.614 1.054 1.054L21.75 12M4.5 9.75v10.5a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V15h3v5.25a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V9.75" />
        </svg>
        Go to Homepage
      </span>
    </router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>