import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import BookmarksView from "../views/BookmarksView.vue";
import Sharing from "../views/Sharing.vue";
import SharingDetail from "../views/SharingDetail.vue";
import ChatLayout from "../views/chat/ChatLayout.vue";
import ChatDetailPage from "../views/chat/ChatDetailPage.vue";
import ChatEmptyState from "../components/chat/ChatEmptyState.vue";
import CommunitiesPage from "../views/community/CommunitiesPage.vue";
import CommunityDetailPage from "../views/community/CommunityDetailPage.vue";
import CommunityCreatePage from "../views/community/CommunityCreatePage.vue";
import CommunityEditPage from "../views/community/CommunityEditPage.vue";
import CommunityPostCreatePage from "../views/communityPosts/CommunityPostCreatePage.vue";
import CommunityPostEditPage from "../views/communityPosts/CommunityPostEditPage.vue";
import CommunityPostDetailPage from "../views/communityPosts/CommunityPostDetailPage.vue"; // Ditambahkan dari konflik
import ArticleList from "../views/ArticleList.vue";
import ArticleCreate from "../views/ArticleCreate.vue";
import ArticleEdit from "../views/ArticleEdit.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import PostDetailView from "../views/PostDetailView.vue";
import MainLayout from "../layouts/MainLayout.vue";
import SharingForm from "../views/SharingForm.vue";

import NotFoundPage from "../views/404.vue";

const routes = [
  // --- Rute Otentikasi ---
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },

  // --- Rute Main Layout (dengan sidebar/navigasi umum) ---
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "profile", name: "profile", component: ProfileView },
      { path: "bookmarks", name: "bookmarks", component: BookmarksView },
      { path: "sharing", name: "sharing", component: Sharing },
      { path: "sharing/:id", name: "SharingDetail", component: SharingDetail },

      // --- Rute Posts ---
      { path: "posts/:id", name: "post-detail", component: PostDetailView, meta: { requiresAuth: false } },

      // --- Rute Komunitas ---
      { path: "communities", name: "communities", component: CommunitiesPage },
      { path: "communities/create", name: "community-create", component: CommunityCreatePage },
      { path: "communities/:id", name: "community-detail", component: CommunityDetailPage },
      { path: "communities/:id/edit", name: "community-edit", component: CommunityEditPage },
      { path: "communities/:communityId/posts/create", name: "community-post-create", component: CommunityPostCreatePage },
      { path: "communities/:communityId/posts/:postId/edit", name: "community-post-edit", component: CommunityPostEditPage },
      { path: "communities/:communityId/posts/:postId", name: "community-post-detail", component: CommunityPostDetailPage },

      // --- Rute Artikel ---
      { path: "articles", name: "articles", component: ArticleList },
      { path: "articles/create", name: "article-create", component: ArticleCreate },
      { path: "articles/edit/:id", name: "article-edit", component: ArticleEdit },
      { path: "articles/:id", name: "article-detail", component: ArticleDetail },
    ]
  },

  // --- Rute Chat (DI LUAR MainLayout, menggunakan ChatLayout) ---
  {
    path: "/chat",
    component: ChatLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "chat.empty", component: ChatEmptyState },
      { path: ":id", name: "chat.detail", component: ChatDetailPage }
    ]
  },

  // --- Rute Form Sharing (DI LUAR MainLayout) ---
  {
    path: '/sharing/create',
    name: 'SharingCreate',
    component: SharingForm,
    meta: { requiresAuth: true }
  },
  {
    path: "/sharing/edit/:id",
    name: "SharingEdit",
    component: SharingForm,
    meta: { requiresAuth: true }
  },

  // --- Rute 404 Not Found ---
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage
  }
];

// --- Inisialisasi Router ---
const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- Navigation Guard (router.beforeEach) ---
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/", "/articles"];
  const isPublicPage = publicPages.some(page => to.path === page || to.path.startsWith(page + "/"));
  const authRequired = !isPublicPage;

  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token");

  if (authRequired && !token) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }

  if (token && (to.path === "/login" || to.path === "/register")) {
    return next("/");
  }

  next();
});

export default router;