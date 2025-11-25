<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue' // 👈 Pastikan path ini sesuai lokasi file Anda

const route = useRoute()
</script>

<template>
  <Navbar v-if="route.path !== '/login' && route.path !== '/register'" />
  
  <RouterView />
</template>