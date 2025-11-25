import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import BookmarksView from "../views/BookmarksView.vue";
import Sharing from "../views/Sharing.vue";
import SharingDetail from "../views/SharingDetail.vue";
import MainLayout from "../layouts/MainLayout.vue";

const routes = [
    { path: "/login", name: "login", component: Login },
    {
        path: "/",
        component: MainLayout,
        children: [
            { path: "", name: "home", component: HomeView },
            { path: "profile", name: "profile", component: ProfileView },
            { path: "bookmarks", name: "bookmarks", component: BookmarksView },
            { path: "sharing", name: "sharing", component: Sharing },
            { path: "sharing/:id", name: "SharingDetail", component: SharingDetail }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/', '/articles'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('auth_token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    if (loggedIn && to.path === '/login') {
        return next('/');
    }

    next();
});

export default router;
