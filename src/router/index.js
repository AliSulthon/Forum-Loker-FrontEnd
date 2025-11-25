import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import Sharing from "@/views/Sharing.vue"
import SharingDetail from "@/views/SharingDetail.vue"


const routes = [
  {
    path: "/",
    redirect: "/login",   
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/sharing",
    name: "Sharing",
    component: Sharing,
  },
  {
    path: '/sharing/:id', 
    component: SharingDetail,
    name: 'SharingDetail',
    meta: { requiresAuth: true }
  },
  
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
