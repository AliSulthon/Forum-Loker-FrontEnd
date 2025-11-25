<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <!-- Community Name -->
    <div>
      <label class="block text-base text-secondary mb-1">Community Name</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Enter community name"
        required
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-base text-secondary mb-1">Description</label>
      <textarea
        v-model="form.description"
        placeholder="Enter community description"
        required
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none h-32 transition resize-none"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition font-medium transform hover:scale-105 duration-200 cursor-pointer"
    >
      {{ isEdit ? "Save Changes" : "Create Community" }}
    </button>
  </form>
</template>

<script setup>
import { reactive, computed } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit"]);

// Jika untuk EDIT → isi form dari props
// Jika CREATE → form kosong
const form = reactive({
  name: props.initialData?.name || "",
  description: props.initialData?.description || "",
});

// Untuk mengganti tulisan button
const isEdit = computed(() => props.initialData !== null);

// Submit handler
function onSubmit() {
  // HTML5 required akan otomatis mencegah submit jika kosong
  emit("submit", { ...form });
}
</script>
