<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    
    <div>
      <label class="block text-sm font-bold text-primary mb-2">Community Name</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Enter community name"
        required
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-primary mb-2">Description</label>
      <textarea
        v-model="form.description"
        placeholder="Enter community description"
        required
        rows="4"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm resize-none"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 
             hover:bg-primary/90 transition-all transform hover:scale-[1.01] duration-200 cursor-pointer"
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
  emit("submit", { ...form });
}
</script>