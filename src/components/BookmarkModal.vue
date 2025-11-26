<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="handleClose"></div>
    <div class="bg-white w-full max-w-lg rounded-[30px] shadow-2xl z-10 p-8 relative overflow-hidden animate-fadein">
      <h2 class="text-2xl font-bold font-namaApp mb-6">Save to Bookmarks</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Mode Selection -->
          <div class="flex gap-3 mb-4">
            <button
              type="button"
              @click="mode = 'new'"
              :class="['flex-1 py-2 px-4 rounded-xl font-bold transition-all', mode === 'new' ? 'bg-blueHeadline text-white' : 'bg-gray-100 text-detail']"
            >
              New Bookmark
            </button>
            <button
              type="button"
              @click="mode = 'existing'"
              :class="['flex-1 py-2 px-4 rounded-xl font-bold transition-all', mode === 'existing' ? 'bg-blueHeadline text-white' : 'bg-gray-100 text-detail']"
            >
              Add to Existing
            </button>
          </div>

          <!-- Existing Bookmark Selection -->
          <div v-if="mode === 'existing'">
            <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Select Bookmark</label>
            <select v-model="selectedBookmarkId" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline" required>
              <option value="">Choose a bookmark...</option>
              <option v-for="bookmark in bookmarksStore.bookmarks" :key="bookmark.id" :value="bookmark.id">
                {{ bookmark.label || `Bookmark ${bookmark.id}` }} ({{ getBookmarkItemCount(bookmark) }} items)
              </option>
            </select>
            <p class="text-xs text-detail mt-1">You can add unlimited posts/articles to any bookmark</p>
          </div>

          <!-- Label -->
          <div v-if="mode === 'new'">
            <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Label</label>
            <input 
              v-model="form.label" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline" 
              placeholder="Give it a name (optional)"
              maxlength="255"
            />
          </div>

          <!-- Note -->
          <div>
            <label class="block text-xs font-bold text-detail uppercase tracking-wider mb-2">Note</label>
            <textarea 
              v-model="form.note" 
              rows="3" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blueHeadline resize-none" 
              placeholder="Add a personal note (optional)"
              maxlength="1000"
            ></textarea>
          </div>

          <!-- Preview -->
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <div class="text-xs font-bold text-blueHeadline uppercase mb-1">{{ itemType }}</div>
            <div class="text-sm font-semibold text-headline">{{ itemTitle }}</div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button 
            type="button" 
            @click="handleClose" 
            class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-detail hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting" 
            class="flex-1 py-3 bg-blueHeadline text-white rounded-xl font-bold hover:bg-bluePrimary disabled:opacity-70 transition"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBookmarksStore } from '../stores/bookmarks';

const props = defineProps({
  show: Boolean,
  itemType: String, // 'post' or 'article'
  itemId: Number,
  itemTitle: String
});

const emit = defineEmits(['close', 'saved']);

const bookmarksStore = useBookmarksStore();
const mode = ref('new');
const selectedBookmarkId = ref('');
const isSubmitting = ref(false);
const form = ref({
  label: '',
  note: ''
});

// Fetch existing bookmarks when modal opens
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await bookmarksStore.fetchBookmarks(1);
    // Auto-fill label with item title
    form.value.label = props.itemTitle;
  }
});

// Watch for selected bookmark change to pre-fill note
watch(selectedBookmarkId, (newId) => {
  if (newId) {
    const selected = bookmarksStore.bookmarks.find(b => b.id === parseInt(newId));
    if (selected && selected.note) {
      form.value.note = selected.note;
    }
  }
});

function getBookmarkItemCount(bookmark) {
  const postCount = bookmark.posts ? bookmark.posts.length : 0;
  const articleCount = bookmark.articles ? bookmark.articles.length : 0;
  return postCount + articleCount;
}

async function handleSubmit() {
  isSubmitting.value = true;
  
  try {
    if (mode.value === 'new') {
      // Create new bookmark with the item
      const bookmarkData = {
        label: form.value.label || props.itemTitle,
        note: form.value.note
      };
      
      if (props.itemType === 'post') {
        bookmarkData.post_ids = [props.itemId];
      } else {
        bookmarkData.article_ids = [props.itemId];
      }
      
      await bookmarksStore.addBookmark(bookmarkData);
      emit('saved', 'Bookmark created successfully!');
    } else {
      // Add item to existing bookmark using the new endpoint
      await bookmarksStore.addItemToBookmark(
        parseInt(selectedBookmarkId.value),
        props.itemType,
        props.itemId
      );
      
      // Optionally update note if changed
      const selectedBookmark = bookmarksStore.bookmarks.find(b => b.id === parseInt(selectedBookmarkId.value));
      if (form.value.note && form.value.note !== selectedBookmark.note) {
        await bookmarksStore.updateBookmark(parseInt(selectedBookmarkId.value), {
          note: form.value.note
        });
      }
      
      emit('saved', 'Added to existing bookmark!');
    }
    
    handleClose();
  } catch (error) {
    console.error(error);
    alert('Failed to save bookmark: ' + (error.response?.data?.message || error.message));
  } finally {
    isSubmitting.value = false;
  }
}

function handleClose() {
  form.value = { label: '', note: '' };
  mode.value = 'new';
  selectedBookmarkId.value = '';
  emit('close');
}
</script>

<style scoped>
@keyframes fadein {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadein {
  animation: fadein 0.2s ease-out;
}
</style>
