import { createRouter, createWebHistory } from "vue-router";

import CommunitiesPage from "../views/community/CommunitiesPage.vue";
import CommunityDetailPage from "../views/community/CommunityDetailPage.vue";
import CreateCommunityPage from "../views/community/CreateCommunityPage.vue";

import CommunityPostsPage from "../views/communityPosts/CommunityPostDetailPage.vue";
import CommunityPostDetailPage from "../views/communityPosts/CommunityPostDetailPage.vue";
import CreateCommunityPostPage from "../views/communityPosts/CreateCommunityPostPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/communities" },

    { path: "/communities", component: CommunitiesPage },
    { path: "/communities/create", component: CreateCommunityPage },
    { path: "/communities/:id", component: CommunityDetailPage },

    { path: "/posts/:id", component: CommunityPostDetailPage },

    {
      path: "/communities/:id/posts/create",
      component: CreateCommunityPostPage,
    },
  ],
});
