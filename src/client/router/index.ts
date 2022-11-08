import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/config',
        name: 'Config',
        component: () => import('../views/Config.vue')
    }
]

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes
})

export default router
