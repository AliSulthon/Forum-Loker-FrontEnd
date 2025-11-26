  <template>
    <div class="flex flex-col h-screen bg-[#F5F5F5]">
      <Navbar />
      
      <main class="flex-1 relative overflow-hidden">
        <RouterView class="h-full w-full" />
      </main>
    </div>
  </template>

  <script setup>
  import Navbar from '../components/Navbar.vue';
  import { RouterView } from 'vue-router';
  </script>