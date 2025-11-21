<template>
  <form class="space-y-5">
    <!-- Community Name -->
    <div>
      <label class="block text-base text-secondary mb-1">Community Name</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Enter community name"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-base text-secondary mb-1">Description</label>
      <textarea
        v-model="form.description"
        placeholder="Enter community description"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none h-32 transition"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="button"
      class="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition font-medium transform hover:scale-105 duration-200 cursor-pointer"
      @click="$emit('submit', form)"
    >
      Create Community
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  name: '',
  description: ''
});
</script>
