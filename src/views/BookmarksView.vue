<script setup>
import { ref, onMounted } from 'vue';
import { useBookmarksStore } from '../stores/bookmarks';

const bookmarksStore = useBookmarksStore();
const message = ref({ type: '', text: '' });
const selectedBookmark = ref(null);
const showDeleteDialog = ref(false);

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
  if (bookmark.post) {
    return bookmark.post.title;
  } else if (bookmark.article) {
    return bookmark.article.title;
  }
  return 'Untitled';
}

function getBookmarkType(bookmark) {
  if (bookmark.post && bookmark.article) return 'Both';
  if (bookmark.post) return 'Post';
  if (bookmark.article) return 'Article';
  return 'Unknown';
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-6 pb-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-headline font-namaApp mb-2">My Bookmarks</h1>
        <p class="text-detail">Manage your saved posts and articles</p>
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
      <div v-else-if="bookmarksStore.bookmarks.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-headline">No bookmarks yet</h3>
        <p class="mt-2 text-detail">Start saving posts and articles to view them here</p>
      </div>

      <!-- Bookmarks List -->
      <div v-else class="space-y-4">
        <div v-for="bookmark in bookmarksStore.bookmarks" :key="bookmark.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <!-- Type Badge -->
              <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold mb-3', bookmark.post && bookmark.article ? 'bg-purple-100 text-purple-700' : bookmark.post ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                {{ getBookmarkType(bookmark) }}
              </span>

              <!-- Title -->
              <h3 class="text-lg font-bold text-headline mb-2">{{ getBookmarkTitle(bookmark) }}</h3>

              <!-- Label -->
              <p v-if="bookmark.label" class="text-sm font-semibold text-blueHeadline mb-1">
                {{ bookmark.label }}
              </p>

              <!-- Note -->
              <p v-if="bookmark.note" class="text-sm text-detail mb-3">
                {{ bookmark.note }}
              </p>

              <!-- Content Preview -->
              <div v-if="bookmark.post" class="text-sm text-gray-600 mb-2 line-clamp-2">
                {{ bookmark.post.content }}
              </div>
              <div v-if="bookmark.article" class="text-sm text-gray-600 mb-2 line-clamp-2">
                {{ bookmark.article.content }}
              </div>

              <!-- Metadata -->
              <div class="text-xs text-detail">
                Saved on {{ new Date(bookmark.created_at).toLocaleDateString() }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button @click="confirmDelete(bookmark)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
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
