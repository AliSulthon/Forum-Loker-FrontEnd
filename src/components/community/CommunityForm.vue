<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Nama Komunitas" />
    <textarea v-model="form.description" placeholder="Deskripsi"></textarea>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({ onSubmit: Function });

const form = reactive({
  name: "",
  description: "",
  user_id: 1,
});

function handleSubmit() {
  props.onSubmit({ ...form });
}
</script>
