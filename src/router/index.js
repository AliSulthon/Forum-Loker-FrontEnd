import { createRouter, createWebHistory } from 'vue-router';

import RegisterView from '../views/Register.vue';
import LoginView from '../views/Login.vue';
import ArticleList from '../views/ArticleList.vue';
import ArticleCreate from '../views/ArticleCreate.vue';

const routes = [
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { path: '/articles', component: ArticleList },
  { path: '/create-article', component: ArticleCreate },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
