import { createRouter, createWebHistory } from 'vue-router';

import RegisterView from '../views/Register.vue';
import Login from '../views/Login.vue';
import ArticleList from '../views/ArticleList.vue';
import ArticleCreate from '../views/ArticleCreate.vue';
import ArticleEdit from '../views/ArticleEdit.vue';
import ArticleDelete from '../views/ArticleDelete.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  {
  path: "/articles",
  name: "articles",
  component: ArticleList,
},
{
  path: "/articles/create",
  name: "article-create",
  component: ArticleCreate,
},
{
  path: "/articles/edit/:id",
  name: "article-edit",
  component: ArticleEdit,
},
{
  path: "/articles/delete/:id",
  name: "article-delete",
  component: ArticleDelete,
},

];

export default createRouter({
  history: createWebHistory(),
  routes,
});

