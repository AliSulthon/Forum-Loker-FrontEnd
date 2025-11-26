<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBookmarksStore } from '../stores/bookmarks';
import { useRouter } from 'vue-router';

const bookmarksStore = useBookmarksStore();
const router = useRouter();
const message = ref({ type: '', text: '' });
const selectedBookmark = ref(null);
const showDeleteDialog = ref(false);
const showDetailModal = ref(false);
const detailBookmark = ref(null);
const searchQuery = ref('');
const showEditModal = ref(false);
const editForm = ref({ id: null, label: '', note: '' });

onMounted(async () => {
  await loadBookmarks();
});

async function loadBookmarks(page = 1) {
  try {
    await bookmarksStore.fetchBookmarks(page);
  } catch (error) {
    showMessage('error', 'Failed to load bookmarks');
  }
}

function showMessage(type, text) {
  message.value = { type, text };
  setTimeout(() => {
    message.value = { type: '', text: '' };
  }, 3000);
}

function confirmDelete(bookmark) {
  selectedBookmark.value = bookmark;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  try {
    await bookmarksStore.deleteBookmark(selectedBookmark.value.id);
    showMessage('success', 'Bookmark deleted successfully');
    showDeleteDialog.value = false;
    selectedBookmark.value = null;
  } catch (error) {
    showMessage('error', 'Failed to delete bookmark');
  }
}

function getBookmarkTitle(bookmark) {
  // For display in card, show label or count of items
  if (bookmark.label) return bookmark.label;
  
  const postCount = bookmark.posts ? bookmark.posts.length : 0;
  const articleCount = bookmark.articles ? bookmark.articles.length : 0;
  
  if (postCount > 0 && articleCount > 0) {
    return `${postCount} Posts & ${articleCount} Articles`;
  } else if (postCount > 0) {
    return `${postCount} Post${postCount > 1 ? 's' : ''}`;
  } else if (articleCount > 0) {
    return `${articleCount} Article${articleCount > 1 ? 's' : ''}`;
  }
  return 'Empty Bookmark';
}

function getBookmarkType(bookmark) {
  const hasPost = bookmark.posts && bookmark.posts.length > 0;
  const hasArticle = bookmark.articles && bookmark.articles.length > 0;
  
  if (hasPost && hasArticle) return 'Both';
  if (hasPost) return 'Post';
  if (hasArticle) return 'Article';
  return 'Empty';
}

function showDetail(bookmark) {
  detailBookmark.value = bookmark;
  showDetailModal.value = true;
}

function navigateToPost(bookmark) {
  showDetailModal.value = false;
  router.push('/');
}

function navigateToArticle(bookmark) {
  showDetailModal.value = false;
  router.push('/articles');
}

async function removeItem(bookmarkId, type, itemId) {
  try {
    await bookmarksStore.removeItemFromBookmark(bookmarkId, type, itemId);
    showMessage('success', 'Item removed from bookmark');
    // Refresh detail if modal is open
    if (showDetailModal.value && detailBookmark.value.id === bookmarkId) {
      const updated = await bookmarksStore.getBookmark(bookmarkId);
      if (updated.success) {
        detailBookmark.value = updated.data;
      }
    }
  } catch (error) {
    showMessage('error', 'Failed to remove item');
  }
}

function openEditModal(bookmark) {
  editForm.value = {
    id: bookmark.id,
    label: bookmark.label || '',
    note: bookmark.note || ''
  };
  showEditModal.value = true;
}

async function handleEditBookmark() {
  try {
    await bookmarksStore.updateBookmark(editForm.value.id, {
      label: editForm.value.label,
      note: editForm.value.note
    });
    showMessage('success', 'Bookmark updated successfully');
    showEditModal.value = false;
    // Refresh detail if open
    if (showDetailModal.value && detailBookmark.value.id === editForm.value.id) {
      const updated = await bookmarksStore.getBookmark(editForm.value.id);
      if (updated.success) {
        detailBookmark.value = updated.data;
      }
    }
  } catch (error) {
    showMessage('error', 'Failed to update bookmark');
  }
}

// Computed filtered bookmarks based on search
const filteredBookmarks = computed(() => {
  if (!searchQuery.value.trim()) {
    return bookmarksStore.bookmarks;
  }
  
  const query = searchQuery.value.toLowerCase();  
  return bookmarksStore.bookmarks.filter(bookmark => {
    const label = (bookmark.label || '').toLowerCase();
    const note = (bookmark.note || '').toLowerCase();
    const type = getBookmarkType(bookmark).toLowerCase();
    
    // Search in posts
    const postsMatch = bookmark.posts && bookmark.posts.some(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    );
    
    // Search in articles
    const articlesMatch = bookmark.articles && bookmark.articles.some(article => 
      article.title.toLowerCase().includes(query) || 
      article.content.toLowerCase().includes(query)
    );
    
    return label.includes(query) || 
           note.includes(query) ||
           type.includes(query) ||
           postsMatch ||
           articlesMatch;
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-6 pb-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-headline font-namaApp mb-2">My Bookmarks</h1>
        <p class="text-detail">Manage your saved posts and articles</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search bookmarks by label, note, or content..."
            class="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline transition"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span v-if="searchQuery" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-detail">
            {{ filteredBookmarks.length }} result(s)
          </span>
        </div>
      </div>

      <!-- Alert Message -->
      <div v-if="message.text" :class="['mb-6 p-4 rounded-xl flex items-start gap-3 animate-fadein', message.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-green-50 border border-green-100 text-green-600']">
        <span class="font-medium text-sm">{{ message.text }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="bookmarksStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blueHeadline"></div>
        <p class="mt-4 text-detail">Loading bookmarks...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookmarks.length === 0 && !searchQuery" class="text-center py-12 bg-white rounded-xl shadow-sm">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-headline">No bookmarks yet</h3>
        <p class="mt-2 text-detail">Start saving posts and articles to view them here</p>
      </div>

      <!-- No Search Results -->
      <div v-else-if="filteredBookmarks.length === 0 && searchQuery" class="text-center py-12 bg-white rounded-xl shadow-sm">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-headline">No results found</h3>
        <p class="mt-2 text-detail">Try searching with different keywords</p>
      </div>

      <!-- Bookmarks List -->
      <div v-else class="space-y-4">
        <div 
          v-for="bookmark in filteredBookmarks" 
          :key="bookmark.id" 
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
          @click="showDetail(bookmark)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <!-- Type Badge -->
              <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold mb-3', bookmark.posts && bookmark.posts.length > 0 && bookmark.articles && bookmark.articles.length > 0 ? 'bg-purple-100 text-purple-700' : bookmark.posts && bookmark.posts.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                {{ getBookmarkType(bookmark) }}
              </span>

              <!-- Title -->
              <h3 class="text-lg font-bold text-headline mb-2">{{ getBookmarkTitle(bookmark) }}</h3>

              <!-- Note Preview -->
              <p v-if="bookmark.note" class="text-sm text-detail mb-3 line-clamp-2">
                {{ bookmark.note }}
              </p>

              <!-- Items count -->
              <div class="text-xs text-detail flex gap-4">
                <span v-if="bookmark.posts && bookmark.posts.length > 0">{{ bookmark.posts.length }} post(s)</span>
                <span v-if="bookmark.articles && bookmark.articles.length > 0">{{ bookmark.articles.length }} article(s)</span>
                <span>·</span>
                <span>Saved on {{ new Date(bookmark.created_at).toLocaleDateString() }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2" @click.stop>
              <button @click="openEditModal(bookmark)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(bookmark)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadein">
        <h3 class="text-xl font-bold text-headline mb-2">Delete Bookmark?</h3>
        <p class="text-detail mb-6">Are you sure you want to delete this bookmark? This action cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button @click="showDeleteDialog = false" class="px-4 py-2 rounded-lg bg-gray-100 text-detail hover:bg-gray-200 transition">
            Cancel
          </button>
          <button @click="handleDelete" class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Bookmark Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-[30px] shadow-2xl max-w-lg w-full p-8 animate-fadein">
        <h2 class="text-2xl font-bold font-namaApp mb-6">Edit Bookmark</h2>
        <form @submit.prevent="handleEditBookmark">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Label</label>
              <input 
                v-model="editForm.label" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline" 
                placeholder="Bookmark label (optional)"
                maxlength="255"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Note</label>
              <textarea 
                v-model="editForm.note" 
                rows="4" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline resize-none" 
                placeholder="Add notes (optional)"
                maxlength="1000"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button 
              type="button" 
              @click="showEditModal = false" 
              class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-detail hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="flex-1 py-3 bg-blueHeadline text-white rounded-xl font-bold hover:bg-bluePrimary transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
      <!-- Pagination -->
      <div v-if="bookmarksStore.totalPages > 1" class="mt-8 flex justify-center gap-2">
        <button 
          @click="loadBookmarks(bookmarksStore.currentPage - 1)" 
          :disabled="bookmarksStore.currentPage === 1"
          class="px-4 py-2 rounded-lg bg-white border border-gray-200 text-detail hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-detail">
          Page {{ bookmarksStore.currentPage }} of {{ bookmarksStore.totalPages }}
        </span>
        <button 
          @click="loadBookmarks(bookmarksStore.currentPage + 1)" 
          :disabled="bookmarksStore.currentPage === bookmarksStore.totalPages"
          class="px-4 py-2 rounded-lg bg-white border border-gray-200 text-detail hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadein">
        <h3 class="text-xl font-bold text-headline mb-2">Delete Bookmark?</h3>
        <p class="text-detail mb-6">Are you sure you want to delete this bookmark? This action cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button @click="showDeleteDialog = false" class="px-4 py-2 rounded-lg bg-gray-100 text-detail hover:bg-gray-200 transition">
            Cancel
          </button>
          <button @click="handleDelete" class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Bookmark Detail Modal -->
    <div v-if="showDetailModal && detailBookmark" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-[30px] shadow-2xl max-w-3xl w-full p-8 animate-fadein max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-3xl font-bold font-namaApp text-headline">{{ detailBookmark.label || 'Bookmark' }}</h2>
            <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold mt-2', detailBookmark.posts && detailBookmark.posts.length > 0 && detailBookmark.articles && detailBookmark.articles.length > 0 ? 'bg-purple-100 text-purple-700' : detailBookmark.posts && detailBookmark.posts.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
              {{ getBookmarkType(detailBookmark) }}
            </span>
          </div>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Note -->
        <div v-if="detailBookmark.note" class="mb-6 bg-gray-50 p-4 rounded-xl">
          <h3 class="text-xs font-bold text-detail uppercase tracking-wider mb-2">Note</h3>
          <p class="text-gray-700 whitespace-pre-wrap">{{ detailBookmark.note }}</p>
        </div>

        <!-- Posts Section -->
        <div v-if="detailBookmark.posts && detailBookmark.posts.length > 0" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-blueHeadline uppercase tracking-wider">Posts ({{ detailBookmark.posts.length }})</h3>
            <button @click="navigateToPost(detailBookmark)" class="text-xs font-bold text-blueHeadline hover:text-bluePrimary flex items-center gap-1">
              View All Posts
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="post in detailBookmark.posts" :key="post.id" class="bg-blue-50 border border-blue-100 rounded-xl p-4 group relative">
              <button @click.stop="removeItem(detailBookmark.id, 'post', post.id)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-blue-200 rounded" title="Remove">
                <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 class="font-bold text-lg text-headline mb-2 pr-6">{{ post.title }}</h4>
              <p class="text-gray-700 text-sm line-clamp-2">{{ post.content }}</p>
            </div>
          </div>
        </div>

        <!-- Articles Section -->
        <div v-if="detailBookmark.articles && detailBookmark.articles.length > 0" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-green-700 uppercase tracking-wider">Articles ({{ detailBookmark.articles.length }})</h3>
            <button @click="navigateToArticle(detailBookmark)" class="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
              View All Articles
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="article in detailBookmark.articles" :key="article.id" class="bg-green-50 border border-green-100 rounded-xl p-4 group relative">
              <button @click.stop="removeItem(detailBookmark.id, 'article', article.id)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-green-200 rounded" title="Remove">
                <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 class="font-bold text-lg text-headline mb-2 pr-6">{{ article.title }}</h4>
              <p class="text-gray-700 text-sm line-clamp-2">{{ article.content }}</p>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="text-xs text-detail text-center pb-4 border-t border-gray-100 pt-4">
          Saved on {{ new Date(detailBookmark.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) }}
        </div>

        <div class="flex gap-3">
          <button @click="showDetailModal = false" class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-detail hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadein {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadein {
  animation: fadein 0.3s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
