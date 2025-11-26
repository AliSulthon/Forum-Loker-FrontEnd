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
import CommunitiesPage from "../views/community/CommunitiesPage.vue";
import CommunityDetailPage from "../views/community/CommunityDetailPage.vue";
import CommunityCreatePage from "../views/community/CommunityCreatePage.vue";
import CommunityEditPage from "../views/community/CommunityEditPage.vue";
import CommunityPostCreatePage from "../views/communityPosts/CommunityPostCreatePage.vue";
import CommunityPostEditPage from "../views/communityPosts/CommunityPostEditPage.vue";
import CommunityPostDetailPage from "../views/communityPosts/CommunityPostDetailPage.vue";
import ArticleList from "../views/ArticleList.vue";
import ArticleCreate from "../views/ArticleCreate.vue";
import ArticleEdit from "../views/ArticleEdit.vue";
import MainLayout from "../layouts/MainLayout.vue";
import SharingForm from '../views/SharingForm.vue'

import NotFoundPage from "../views/404.vue";

const routes = [
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    {
        path: "/",
        component: MainLayout,
        children: [
            { path: "", name: "home", component: HomeView },
            { path: "profile", name: "profile", component: ProfileView },
            { path: "bookmarks", name: "bookmarks", component: BookmarksView },
            { path: "sharing", name: "sharing", component: Sharing },
            { path: "sharing/:id", name: "SharingDetail", component: SharingDetail },
            // Chat routes
            { path: "chat", name: "chat", component: ChatLayout },
            { path: "chat/:id", name: "chat-detail", component: ChatDetailPage },
            // Community routes
            { path: "communities", name: "communities", component: CommunitiesPage },
            { path: "communities/create", name: "community-create", component: CommunityCreatePage },
            { path: "communities/:id", name: "community-detail", component: CommunityDetailPage },
            { path: "communities/:id/edit", name: "community-edit", component: CommunityEditPage },
            { path: "communities/:communityId/posts/create", name: "community-post-create", component: CommunityPostCreatePage },
            { path: "communities/:communityId/posts/:postId/edit", name: "community-post-edit", component: CommunityPostEditPage },
            { path: "communities/:communityId/posts/:postId", name: "community-post-detail", component: CommunityPostDetailPage },
            // Article routes
            { path: "articles", name: "articles", component: ArticleList },
            { path: "articles/create", name: "article-create", component: ArticleCreate },
            { path: "articles/edit/:id", name: "article-edit", component: ArticleEdit },


            // 404 Not Found route
            { 
              path: '/:catchAll(.*)',
              name: 'NotFound',
              component: NotFoundPage 
            }
        ]
    },
    {
    path: '/sharing/create',
    name: 'SharingCreate',
    component: SharingForm,
    meta: { requiresAuth: true }
  },
  
  // Route Edit (Menerima parameter ID)
  {
    path: '/sharing/edit/:id',
    name: 'SharingEdit',
    component: SharingForm,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/', '/articles'];
    
    const isPublicPage = publicPages.some(page => 
        to.path === page || to.path.startsWith(page + '/')
    );
    
    const authRequired = !isPublicPage;
    
    const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
    const userInfo = 
        localStorage.getItem("user_info") ||
        sessionStorage.getItem("user_info");

    if (authRequired && !token) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath } 
        });
    }

    if (token && (to.path === '/login' || to.path === '/register')) {
        return next('/');
    }

    next();
});

export default router;
