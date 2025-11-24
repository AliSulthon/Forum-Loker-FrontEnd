import { createRouter, createWebHistory } from "vue-router";

import CommunitiesPage from "../views/community/CommunitiesPage.vue";
import CommunityDetailPage from "../views/community/CommunityDetailPage.vue";
import CommunityCreatePage from "../views/community/CommunityCreatePage.vue";
import CommunityEditPage from "../views/community/CommunityEditPage.vue";

import CommunityCreatePostPage from "../views/communityPosts/CommunityPostCreatePage.vue";
import CommunityEditPostPage from "../views/communityPosts/CommunityPostEditPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/communities" },

    { path: "/communities", component: CommunitiesPage },
    { path: "/communities/create", component: CommunityCreatePage },
    { path: "/communities/:id", component: CommunityDetailPage },
    {
      path: "/communities/:id/edit",
      component: CommunityEditPage,
    },
    {
      path: "/communities/:id/posts/create",
      component: CommunityCreatePostPage,
    },
    {
      path: "/communities/:id/posts/:postId/edit",
      component: CommunityEditPostPage,
    },
  ],
});
