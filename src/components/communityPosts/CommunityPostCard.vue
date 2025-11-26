<template>
  <div 
    class="relative p-5 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
    @click="$emit('select', post)"
  >

    <h3 class="font-bold text-lg text-black mb-2 line-clamp-1">
      {{ post.title }}
    </h3>

    <p class="text-sm text-secondary line-clamp-2 mb-4">
      {{ post.content }}
    </p>

    <div class="flex items-center justify-between text-xs text-secondary">
      <span class="font-semibold">{{ authorName }}</span>
      <span class="text-gray-500">{{ formattedDate }}</span>
    </div>

    <div
      v-if="post.user_id === currentUserId"
      class="absolute top-3 right-3 z-10"
    >
      <button 
        @click.stop="showMenu = !showMenu" 
        class="p-1 rounded-full text-gray-400 hover:text-primary hover:bg-gray-100 transition-all"
        title="Post actions"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
      </button>

      <div 
        v-if="showMenu" 
        @click.stop
        @mouseleave="showMenu = false"
        class="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden"
      >
        <button 
          @click="$emit('edit', post); showMenu = false" 
          class="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.75" /></svg>
          Edit
        </button>

        <button 
          @click="$emit('delete', post); showMenu = false" 
          class="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .5m5.716 0h.008v.008h-.008v-.008zm1.875 0h.008v.008h-.008v-.008z" /></svg>
          Delete
        </button>
      </div>
    </div>

  </div>
</template>


<script setup>
import { computed, ref } from "vue"; 

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  currentUserId: Number
});

const emit = defineEmits(['select', 'edit', 'delete']);

const showMenu = ref(false);

const authorName = computed(() => {
  return props.post.user?.username || `User ID ${props.post.user_id}`; 
});

const formattedDate = computed(() => {
  if (!props.post.created_at) return "";
  
  try {
    const d = new Date(props.post.created_at);
    
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch (error) {
    console.error('Invalid date:', props.post.created_at);
    return "";
  }
});
</script>