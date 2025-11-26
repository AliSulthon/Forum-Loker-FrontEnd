<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    
    <div>
      <label class="block text-sm font-bold text-primary mb-2">Title</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Enter post title"
        required
        maxlength="200"
        :disabled="isLoading"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm disabled:bg-gray-200 disabled:text-gray-500"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-primary mb-2">Content</label>
      <textarea
        v-model="form.content"
        placeholder="Enter post content"
        required
        :disabled="isLoading"
        rows="8" 
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm resize-none h-32 disabled:bg-gray-200 disabled:text-gray-500"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 
             hover:bg-primary/90 transition-all transform hover:scale-[1.01] duration-200 cursor-pointer 
             disabled:opacity-70 disabled:bg-primary/70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    >
      <span v-if="isLoading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'Processing...' : (isEdit ? "Save Changes" : "Publish Post") }}
      </span>
      <span v-else>
        {{ isEdit ? "Save Changes" : "Publish Post" }}
      </span>
    </button>
  </form>
</template>

<script setup>
import { reactive, computed, watch } from "vue";

const props = defineProps({
  initialData: { type: Object, default: null },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit']);

const form = reactive({
  title: props.initialData?.title || "",
  content: props.initialData?.content || ""
});

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title || "";
      form.content = newData.content || "";
    } else {
      form.title = "";
      form.content = "";
    }
  },
  { immediate: true }
);

const isEdit = computed(() => props.initialData !== null);

function onSubmit() {
  emit('submit', { title: form.title.trim(), content: form.content.trim() });
}
</script>