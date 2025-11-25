<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <!-- Title -->
    <div>
      <label class="block text-base text-secondary mb-1">Title</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Enter post title"
        required
        maxlength="200"
        :disabled="isLoading"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
      />
    </div>

    <!-- Content -->
    <div>
      <label class="block text-base text-secondary mb-1">Content</label>
      <textarea
        v-model="form.content"
        placeholder="Enter post content"
        required
        :disabled="isLoading"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none h-32 transition resize-none"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isLoading"
      class="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition font-medium transform hover:scale-105 duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {{ isLoading ? 'Loading...' : (isEdit ? "Save Changes" : "Publish Post") }}
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
  // HTML5 required akan mencegah submit jika kosong
  emit('submit', { title: form.title.trim(), content: form.content.trim() });
}
</script>
