<template>
  <form class="space-y-5">
    <!-- Title -->
    <div>
      <label class="text-base text-secondary mb-1 block">Title</label>
      <input
        v-model="form.title"
        placeholder="Enter post title"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none transition"
      />
    </div>

    <!-- Content -->
    <div>
      <label class="text-base text-secondary mb-1 block">Content</label>
      <textarea
        v-model="form.content"
        placeholder="Enter post content"
        class="w-full px-4 py-3 rounded-xl border border-primary focus:border-primary-light focus:ring-1 focus:ring-primary-light outline-none h-32 transition"
      ></textarea>
    </div>

    <!-- Publish Button -->
    <button
      type="button"
      class="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition font-medium transform hover:scale-105 duration-200 cursor-pointer"
      @click="$emit('submit', form)"
    >
      Publish Post
    </button>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  title: '',
  content: ''
});
</script>
