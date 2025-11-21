<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />

    <KeepAlive>
  <router-view />
</KeepAlive>
  </div>
</template>

<script setup>
import NavBar from '/src/components/NavBar.vue'
</script>
