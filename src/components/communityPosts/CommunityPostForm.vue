<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">

    <!-- Title -->
    <div>
      <label class="block text-base text-secondary mb-1">Title</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Enter post title"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
        required
      />
    </div>

    <!-- Content -->
    <div>
      <label class="block text-base text-secondary mb-1">Content</label>
      <textarea
        v-model="form.content"
        placeholder="Enter post content"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none h-32 transition"
        required
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition font-medium transform hover:scale-105 duration-200 cursor-pointer"
    >
      {{ isEdit ? "Save Changes" : "Publish Post" }}
    </button>

  </form>
</template>

<script setup>
import { reactive, computed, watch } from "vue";

const props = defineProps({
  initialData: { 
    type: Object, 
    default: null 
  }
});

const emit = defineEmits(['submit']);

// Form otomatis terisi saat EDIT
const form = reactive({
  title: "",
  content: ""
});

// Watch untuk update form saat initialData berubah (PENTING!)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title || "";
      form.content = newData.content || "";
    } else {
      // Reset form jika create
      form.title = "";
      form.content = "";
    }
  },
  { immediate: true } // Jalankan segera saat component mount
);

// Untuk menentukan tombol
const isEdit = computed(() => props.initialData !== null);

// Handle submit
function handleSubmit() {
  emit('submit', { ...form });
}
</script>