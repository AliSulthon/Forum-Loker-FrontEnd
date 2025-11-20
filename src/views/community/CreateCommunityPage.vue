<template>
  <div>
    <h2>Create Community</h2>
    <CommunityForm :onSubmit="submit" />
  </div>
</template>

<script setup>
import CommunityForm from "../../components/community/CommunityForm.vue";
import { useCommunityStore } from "../../stores/communityStore";
import { useRouter } from "vue-router";

const store = useCommunityStore();
const router = useRouter();

function submit(data) {
  store.addCommunity(data);
  router.push("/communities");
}
</script>
