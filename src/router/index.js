import { createRouter, createWebHistory } from "vue-router";
import CommunitiesPage from "../views/community/CommunitiesPage.vue";
import CommunityDetailPage from "../views/community/CommunityDetailPage.vue";
import CommunityCreatePage from "../views/community/CommunityCreatePage.vue";
import CommunityEditPage from "../views/community/CommunityEditPage.vue";
import CommunityCreatePostPage from "../views/communityPosts/CommunityPostCreatePage.vue";
import CommunityEditPostPage from "../views/communityPosts/CommunityPostEditPage.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },

  { path: "/communities", component: CommunitiesPage },
  { path: "/communities/create", component: CommunityCreatePage },
  { path: "/communities/:id", component: CommunityDetailPage },
  { path: "/communities/:id/edit", component: CommunityEditPage },
  { path: "/communities/:id/posts/create", component: CommunityCreatePostPage },
  {
    path: "/communities/:id/posts/:postId/edit",
    component: CommunityEditPostPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// === Router Guard ===
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("auth_token");

  if (authRequired && !loggedIn) {
    // Jika halaman butuh login tapi user belum login
    return next("/login");
  }

  if (loggedIn && to.path === "/login") {
    // Jika user sudah login tapi mencoba buka login
    return next("/communities");
  }

  next();
});

export default router;
