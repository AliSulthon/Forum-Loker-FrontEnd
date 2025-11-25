<template>
  <div class="space-y-8">
    
    <div v-if="currentUser" class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 class="text-lg font-bold font-namaApp mb-4 text-black">Buat Postingan Baru</h3>
      
      <form @submit.prevent="handleCreatePost" class="space-y-4">
        <div>
          <input 
            v-model="newPost.title"
            type="text" 
            placeholder="Judul diskusi..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            required
          />
        </div>
        <div>
          <textarea 
            v-model="newPost.content"
            rows="3" 
            placeholder="Apa yang ingin Anda diskusikan?" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Mengirim...' : 'Posting' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
      <p class="text-gray-700">
        Ingin bergabung dalam diskusi? 
        <RouterLink to="/login" class="text-primary font-bold hover:underline">Login disini</RouterLink> 
        untuk membuat postingan.
      </p>
    </div>

    <div class="text-left border-b border-gray-200 pb-6">
      <h2 class="text-3xl md:text-4xl font-namaApp font-bold text-black tracking-tight">
        Latest Discussions
      </h2>
      <p class="text-[#929292] mt-2 text-lg font-normal">
        Temukan lowongan kerja dan diskusi pemrograman terbaru.
      </p>
    </div>

    <div v-if="loading" class="py-12 flex justify-center">
      <div class="flex flex-col items-center gap-4 text-[#929292]">
        <span class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
        <span class="text-sm font-medium">Memuat data...</span>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-[#929292]">Belum ada postingan saat ini.</p>
    </div>

    <div v-else class="grid gap-6">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="group bg-white rounded-2xl p-6 border border-[#E9E9E9] hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-in-out flex flex-col md:flex-row gap-6 relative"
      >
        
        <div class="absolute top-4 right-4 z-10">
          <button class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </button>
          </div>

        <div class="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-[#14BEF0]/10 items-center justify-center group-hover:scale-110 transition-transform duration-300">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-[#14BEF0]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
        </div>

        <div class="flex-1 flex flex-col justify-between pr-8"> <div v-if="editingPostId === post.id" class="space-y-3 mb-4">
            <input v-model="editForm.title" class="w-full px-3 py-2 border rounded" placeholder="Edit Judul">
            <textarea v-model="editForm.content" class="w-full px-3 py-2 border rounded" rows="3" placeholder="Edit Konten"></textarea>
            <div class="flex gap-2">
              <button @click="handleUpdatePost(post.id)" class="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">Simpan</button>
              <button @click="cancelEdit" class="bg-gray-400 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-500">Batal</button>
            </div>
          </div>

          <div v-else>
            <div class="flex justify-between items-start mb-2">
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                  Discussion
                </span>
                <h3 class="text-xl md:text-2xl font-bold font-namaApp text-black group-hover:text-primary transition-colors duration-200 cursor-pointer line-clamp-2">
                  {{ post.title }}
                </h3>
              </div>
              <span class="text-sm font-medium text-[#929292] whitespace-nowrap ml-4 bg-gray-50 px-2 py-1 rounded">
                {{ formatDate(post.created_at) }}
              </span>
            </div>

            <p class="text-gray-600 leading-relaxed line-clamp-3 mb-4">
              {{ post.content }}
            </p>
          </div>

          <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div class="flex items-center gap-4 text-sm text-[#929292]">
              <div class="flex items-center gap-2 group/user cursor-pointer">
                <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  {{ post.user?.name?.charAt(0).toUpperCase() || '?' }}
                </div>
                <span class="font-semibold text-gray-700 group-hover/user:text-primary transition-colors">
                  {{ post.user ? post.user.name : 'Anonymous' }}
                </span>
              </div>
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span>{{ post.comments_count || 0 }} Komentar</span>
              </div>
            </div>

            <div v-if="isOwner(post) && editingPostId !== post.id" class="flex gap-2">
              <button @click="startEditing(post)" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                Edit
              </button>
              <button @click="handleDeletePost(post.id)" class="text-sm font-medium text-red-600 hover:text-red-800 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api'; // Menggunakan services/api.js yang sudah kita buat sebelumnya

// STATE
const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);
const isSubmitting = ref(false);

// Form State
const newPost = reactive({ title: '', content: '' });
const editingPostId = ref(null);
const editForm = reactive({ title: '', content: '' });

// 1. CEK LOGIN USER
const checkCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    currentUser.value = JSON.parse(userStr);
  }
};

// Cek apakah post milik user yang sedang login
const isOwner = (post) => {
  return currentUser.value && post.user_id === currentUser.value.id;
};

// Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

// --- CRUD OPERATIONS ---

// READ (GET)
const fetchPosts = async () => {
  try {
    const response = await api.get('/posts'); // Otomatis ke http://127.0.0.1:8000/api/posts
    posts.value = response.data.data ? response.data.data : response.data;
  } catch (err) {
    console.error(err);
    error.value = 'Gagal memuat data postingan.';
  } finally {
    loading.value = false;
  }
};

// CREATE (POST)
const handleCreatePost = async () => {
  if (!currentUser.value) return alert("Silakan login terlebih dahulu!");
  isSubmitting.value = true;
  
  try {
    // Backend PostController butuh user_id di body request
    const payload = {
      title: newPost.title,
      content: newPost.content,
      user_id: currentUser.value.id 
    };

    const response = await api.post('/posts', payload);
    
    // Refresh list posts & reset form
    await fetchPosts();
    newPost.title = '';
    newPost.content = '';
    alert("Postingan berhasil dibuat!");
    
  } catch (err) {
    console.error(err);
    alert(err.message || "Gagal membuat postingan.");
  } finally {
    isSubmitting.value = false;
  }
};

// UPDATE (PUT/PATCH) - Start Edit
const startEditing = (post) => {
  editingPostId.value = post.id;
  editForm.title = post.title;
  editForm.content = post.content;
};

const cancelEdit = () => {
  editingPostId.value = null;
};

const handleUpdatePost = async (id) => {
  try {
    await api.put(`/posts/${id}`, {
      title: editForm.title,
      content: editForm.content
    });
    
    await fetchPosts(); // Refresh data
    editingPostId.value = null; // Keluar mode edit
    alert("Postingan berhasil diperbarui!");
    
  } catch (err) {
    console.error(err);
    alert("Gagal memperbarui postingan.");
  }
};

// DELETE
const handleDeletePost = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) return;
  
  try {
    await api.delete(`/posts/${id}`);
    await fetchPosts(); // Refresh data
    alert("Postingan berhasil dihapus.");
  } catch (err) {
    console.error(err);
    alert("Gagal menghapus postingan.");
  }
};

// Lifecycle Hooks
onMounted(() => {
  checkCurrentUser();
  fetchPosts();
});
</script>