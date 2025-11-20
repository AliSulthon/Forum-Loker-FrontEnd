<template>
  <div>
    <h2>Add Post</h2>
    <CommunityPostForm
      :communityId="communityId"
      :onSubmit="submit"
    />
  </div>
</template>

<script setup>
import CommunityPostForm from "../../components/communityPosts/CommunityPostForm.vue";
import { useCommunityPostStore } from "../../stores/communityPostStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const communityId = Number(route.params.id);

const store = useCommunityPostStore();

function submit(data) {
  store.addPost(data);
  router.push(`/communities/${communityId}`);
}
</script>
