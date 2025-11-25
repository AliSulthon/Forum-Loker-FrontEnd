<template>
  <div class="min-h-screen bg-[#F5F5F5]">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import { RouterView } from 'vue-router';
</script>
