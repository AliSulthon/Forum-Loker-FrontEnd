<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.title" placeholder="Judul Post" />
    <textarea v-model="form.content" placeholder="Isi postingan"></textarea>
    <button type="submit">Tambah Post</button>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  communityId: Number,
  onSubmit: Function
});

const form = reactive({
  title: "",
  content: "",
  user_id: 1
});

function handleSubmit() {
  props.onSubmit({
    ...form,
    community_id: props.communityId
  });
}
</script>
