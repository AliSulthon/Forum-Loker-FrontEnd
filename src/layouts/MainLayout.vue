<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <Navbar />
    <main class="w-full px-6 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script>