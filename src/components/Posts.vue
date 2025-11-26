<template>
  <div class="space-y-8">
    
    <div v-if="currentUser" class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition hover:shadow-md">
      <h3 class="text-lg font-bold font-namaApp mb-4 text-black">Buat Postingan Baru</h3>
      
      <form @submit.prevent="handleCreatePost" class="space-y-4">
        <div>
          <input 
            v-model="newPost.title"
            type="text" 
            placeholder="Judul Post" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-gray-50 focus:bg-white"
            required
          />
        </div>
        <div>
          <textarea 
            v-model="newPost.content"
            rows="3" 
            placeholder="Deskripsi Post" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none bg-gray-50 focus:bg-white"
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 shadow-sm hover:shadow"
          >
            {{ isSubmitting ? 'Mengirim...' : 'Post' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center shadow-sm">
      <p class="text-gray-700">
        Ingin bergabung dalam diskusi? 
        <RouterLink to="/login" class="text-primary font-bold hover:underline">Login disini</RouterLink> 
        untuk membuat postingan.
      </p>
    </div>

    <div class="text-left border-b border-gray-200 pb-6">
      <h2 class="text-3xl md:text-4xl font-namaApp font-bold text-black tracking-tight">
        Latest Posts
      </h2>
      <p class="text-[#929292] mt-2 text-lg font-normal">
        Temukan postingan-postingan terbaru.
      </p>
    </div>

    <div v-if="loading" class="py-12 flex justify-center">
      <div class="flex flex-col items-center gap-4 text-[#929292]">
        <span class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
        <span class="text-sm font-medium">Memuat data...</span>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-[#929292]">Belum ada postingan saat ini.</p>
    </div>

    <div v-else class="grid gap-6">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="bg-white rounded-2xl border border-[#E9E9E9] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div class="p-6 relative">
            
            <div class="absolute top-6 right-6 z-10" ref="postMenuRef">
              <button @click="togglePostMenu(post.id)" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button>
              <!-- Dropdown Menu -->
              <div v-if="openPostMenuId === post.id" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button @click="handleBookmarkPost(post)" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Bookmark
                </button>
              </div>
            </div>

            <div class="flex-1"> 
              
              <div v-if="editingPostId === post.id" class="space-y-3 mb-4 pr-12">
                <input v-model="editForm.title" class="w-full px-3 py-2 border rounded focus:ring-primary" placeholder="Edit Judul">
                <textarea v-model="editForm.content" class="w-full px-3 py-2 border rounded focus:ring-primary" rows="3" placeholder="Edit Konten"></textarea>
                <div class="flex gap-2">
                  <button @click="handleUpdatePost(post.id)" class="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">Simpan</button>
                  <button @click="cancelEdit" class="bg-gray-400 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-500">Batal</button>
                </div>
              </div>

              <div v-else class="pr-12">
                <div class="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit">
                    Post
                  </span>
                  <span class="text-sm font-medium text-[#929292]">{{ formatDate(post.created_at) }}</span>
                </div>
                
                <h3 class="text-xl md:text-2xl font-bold font-namaApp text-black mb-3 cursor-pointer hover:text-primary transition-colors">
                  {{ post.title }}
                </h3>

                <p class="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                  {{ post.content }}
                </p>
              </div>

              <div class="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 gap-4">
                
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 group/user cursor-pointer">
                        <!-- <div class="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                          {{ post.user?.name?.charAt(0).toUpperCase() || '?' }}
                        </div>
                        <span class="font-semibold text-gray-700 group-hover/user:text-primary transition-colors">
                          {{ post.user ? post.user.name : 'Anonymous' }}
                        </span> -->
                    </div>

                    <button 
                      @click="toggleComments(post.id)"
                      class="flex items-center gap-2 text-[#929292] hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 bg-white border border-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      <span class="font-medium text-sm">
                        {{ post.comments_count || 0 }} Comments
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                        class="w-3 h-3 transition-transform duration-200"
                        :class="expandedPostId === post.id ? 'rotate-180' : ''"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                </div>

                <div v-if="isOwner(post) && editingPostId !== post.id" class="flex gap-2">
                  <button 
                    @click="startEditing(post)" 
                    class="bg-[#2AA8FF] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition shadow-sm"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDeletePost(post.id)" 
                    class="bg-[#2AA8FF] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition shadow-sm"
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
        </div>

        <div v-if="expandedPostId === post.id" class="bg-gray-50 border-t border-gray-100 p-6 animate-fadeIn">
          
          <div v-if="currentUser" class="mb-6 flex gap-3">
             <form @submit.prevent="handleCreateComment(post.id)" class="flex-1 relative">
                <input 
                  v-model="newCommentTexts[post.id]"
                  type="text" 
                  placeholder="Tulis komentar..."
                  class="w-full pl-4 pr-12 py-2 text-sm border border-gray-300 rounded-full focus:ring-1 focus:ring-primary focus:border-primary outline-none transition bg-white"
                  required
                />
                <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A2.001 2.001 0 0 0 5.635 10a2.001 2.001 0 0 0-1.938 1.836l-1.414 4.925a.75.75 0 0 0 .826.95 28.89 28.89 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                  </svg>
                </button>
             </form>
          </div>
          <div v-else class="mb-6 text-center text-sm text-gray-500">
             <RouterLink to="/login" class="text-primary hover:underline">Login</RouterLink> untuk berkomentar.
          </div>

          <div v-if="loadingComments[post.id]" class="text-center py-4 text-gray-400 text-sm">
            Memuat komentar...
          </div>
          
          <div v-else-if="postComments[post.id] && postComments[post.id].length > 0" class="space-y-4">
            <div v-for="comment in postComments[post.id]" :key="comment.id" class="flex gap-3 group/comment">
               
               <div class="flex-1">
                  <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm inline-block min-w-[200px]">
                    <div v-if="editingCommentId !== comment.id">
                       <div class="flex justify-between items-center mb-1">
                          <span class="font-bold text-xs text-gray-800">{{ comment.user?.name || 'Anonymous' }}</span>
                          <span class="text-[10px] text-gray-400">{{ formatDate(comment.created_at) }}</span>
                       </div>
                       <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p> 
                    </div>
                    <div v-else class="w-full">
                       <textarea v-model="editCommentText" rows="2" class="w-full text-sm p-2 border border-gray-300 rounded-md"></textarea>
                       <div class="flex justify-end gap-2 mt-2">
                          <button @click="handleUpdateComment(comment.id, post.id)" class="text-xs bg-primary text-white px-2 py-1 rounded">Save</button>
                          <button @click="editingCommentId = null" class="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">Cancel</button>
                       </div>
                    </div>
                  </div>
                  <div v-if="isOwnerOfComment(comment) && editingCommentId !== comment.id" class="flex gap-3 mt-1 ml-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                     <button @click="startEditingComment(comment)" class="text-xs text-blue-500 hover:underline">Edit</button>
                     <button @click="handleDeleteComment(comment.id, post.id)" class="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
               </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-400 text-sm italic">
            Belum ada komentar.
          </div>
        </div>

      </div>
    </div>

    <!-- Bookmark Modal -->
    <BookmarkModal
      :show="showBookmarkModal"
      :item-type="bookmarkItem.type"
      :item-id="bookmarkItem.id"
      :item-title="bookmarkItem.title"
      @close="showBookmarkModal = false"
      @saved="handleBookmarkSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore(); 
import { useBookmarksStore } from '../stores/bookmarks';
import BookmarkModal from './BookmarkModal.vue';

const bookmarksStore = useBookmarksStore();

const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);


//computed dari store
const currentUser = computed(() => authStore.user);

const newPost = reactive({ title: '', content: '' });
const editingPostId = ref(null);
const editForm = reactive({ title: '', content: '' });

const expandedPostId = ref(null);
const postComments = ref({});
const loadingComments = ref({});
const newCommentTexts = ref({});
const editingCommentId = ref(null);
const editCommentText = ref('');
const openPostMenuId = ref(null);
const postMenuRef = ref(null);
const showBookmarkModal = ref(false);
const bookmarkItem = ref({ type: '', id: null, title: '' });

// --- HELPERS ---
const isOwner = (post) => currentUser.value && post.user_id === currentUser.value.id;
const isOwnerOfComment = (comment) => currentUser.value && comment.user_id === currentUser.value.id;

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// --- POST LOGIC ---
const fetchPosts = async () => {
  try {
    const response = await api.get('/posts'); 
    posts.value = response.data.data ? response.data.data : response.data;
  } catch (err) { 
    console.error(err); 
    error.value = 'Gagal memuat data.'; 
  } 
  finally { 
    loading.value = false; 
  }
};

const handleCreatePost = async () => {
  //Cek auth dari store
  if (!authStore.isAuthenticated || !currentUser.value) {
    alert("Silakan login terlebih dahulu!");
    router.push('/login');
    return;
  }
  
  isSubmitting.value = true;
  try {
    const response = await api.post('/posts', {
      title: newPost.title,
      content: newPost.content,
      user_id: currentUser.value.id 
    });
    const createdPost = response.data.data || response.data; 
    posts.value.unshift(createdPost); 
    newPost.title = '';
    newPost.content = '';
    alert("Postingan berhasil dibuat!");
  } catch (err) {
    console.error(err);
    
    // Handle unauthorized
    if (err.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal posting: " + (err.response?.data?.message || err.message));
    }
  } finally {
    isSubmitting.value = false;
  }
};

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
    const index = posts.value.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.value[index].title = editForm.title;
      posts.value[index].content = editForm.content;
    }
    editingPostId.value = null;
    alert("Postingan berhasil diperbarui!");
  } catch (err) { 
    console.error(err);
    
    //Handle unauthorized
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal update.");
    }
  }
};

const handleDeletePost = async (id) => {
  if (!confirm("Hapus postingan ini?")) return;
  try {
    await api.delete(`/posts/${id}`);
    posts.value = posts.value.filter(p => p.id !== id);
    alert("Postingan dihapus.");
  } catch (err) { 
    console.error(err);
    
    //Handle unauthorized
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal hapus.");
    }
  }
};

// --- COMMENT LOGIC ---
const toggleComments = async (postId) => {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null;
  } else { 
    expandedPostId.value = postId; 
    await fetchComments(postId); 
  }
};

const fetchComments = async (postId) => {
  loadingComments.value[postId] = true;
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    postComments.value[postId] = response.data.data;
  } catch (err) { 
    console.error(err); 
  } 
  finally { 
    loadingComments.value[postId] = false; 
  }
};

const handleCreateComment = async (postId) => {
  const text = newCommentTexts.value[postId];
  if (!text || !text.trim()) return;
  
  if (!authStore.isAuthenticated) {
    alert("Silakan login untuk berkomentar!");
    router.push('/login');
    return;
  }
  
  try {
    const response = await api.post(`/posts/${postId}/comments`, { 
      content: text 
    });
    
    if (!postComments.value[postId]) postComments.value[postId] = [];
    postComments.value[postId].unshift(response.data.data);
    
    const postIndex = posts.value.findIndex(p => p.id === postId);
    if (postIndex !== -1) posts.value[postIndex].comments_count++;

    newCommentTexts.value[postId] = '';
  } catch (err) { 
    console.error(err);
    
    if (err.response?.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal kirim komentar: " + (err.response?.data?.message || err.message));
    }
  }
};

const startEditingComment = (comment) => {
  editingCommentId.value = comment.id;
  editCommentText.value = comment.content; 
};

const handleUpdateComment = async (commentId, postId) => {
  try {
    await api.put(`/comments/${commentId}`, { 
      content: editCommentText.value 
    });
    
    const comments = postComments.value[postId];
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) comments[index].content = editCommentText.value;
    
    editingCommentId.value = null;
  } catch (err) { 
    console.error(err);
    
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal update komentar");
    }
  }
};

const handleDeleteComment = async (commentId, postId) => {
  if (!confirm("Hapus komentar?")) return;
  try {
    await api.delete(`/comments/${commentId}`);
    postComments.value[postId] = postComments.value[postId].filter(c => c.id !== commentId);
    const postIndex = posts.value.findIndex(p => p.id === postId);
    if (postIndex !== -1 && posts.value[postIndex].comments_count > 0) {
      posts.value[postIndex].comments_count--;
    }
  } catch (err) { 
    console.error(err);
    
  
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    } else {
      alert("Gagal hapus komentar");
    }
  }
};

// --- BOOKMARK LOGIC ---
const togglePostMenu = (postId) => {
  openPostMenuId.value = openPostMenuId.value === postId ? null : postId;
};

const handleBookmarkPost = (post) => {
  bookmarkItem.value = {
    type: 'post',
    id: post.id,
    title: post.title
  };
  showBookmarkModal.value = true;
  openPostMenuId.value = null;
};

const handleBookmarkSaved = (message) => {
  showBookmarkModal.value = false;
  alert(message);
};

// Click outside to close menu
const handleClickOutside = (event) => {
  if (postMenuRef.value && !postMenuRef.value.contains(event.target)) {
    openPostMenuId.value = null;
  }
};
onMounted(() => {
  console.log('=== DEBUG INFO (Posts.vue) ===');
  console.log('Auth Store Token:', authStore.token);
  console.log('Auth Store User:', authStore.user?.name);
  console.log('Is Authenticated:', authStore.isAuthenticated);
  console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
  console.log('localStorage user_info:', localStorage.getItem('user_info'));
  console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token'));
  console.log('sessionStorage user_info:', sessionStorage.getItem('user_info'));
  console.log('================================');
  
  authStore.loadFromStorage();
  
  fetchPosts();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>