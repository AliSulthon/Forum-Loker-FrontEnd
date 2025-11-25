import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ProfileView from "../views/ProfileView.vue";
import BookmarksView from "../views/BookmarksView.vue";
import MainLayout from "../layouts/MainLayout.vue";

const routes = [
    { path: "/login", component: Login },
    {
        path: "/",
        component: MainLayout,
        children: [
            { path: "profile", name: "profile", component: ProfileView },
            { path: "bookmarks", name: "bookmarks", component: BookmarksView }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
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
