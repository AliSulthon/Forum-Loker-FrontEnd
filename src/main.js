import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'

// 1. Import store Anda
import { useAuthStore } from '@/stores/auth.js' // <-- Pastikan path ini benar

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

// 2. Akses store otentikasi
const authStore = useAuthStore();

// 3. Panggil fungsi initialize()
// Fungsi ini akan mengecek apakah ada token di Local Storage dan
// mengaturnya sebagai default header pada Axios.
authStore.initialize(); 

app.use(router);
app.mount('#app');
