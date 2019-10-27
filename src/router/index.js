import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 布局组件
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页' },
        component: () => import('../views/home')
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: '/',
        meta: { title: '会员管理' },
        component: () => import('../views/member')
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    children: [
      {
        path: '/',
        meta: { title: '供应商管理' },
        component: () => import('../views/supplier')
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: '/',
        meta: { title: '商品管理' },
        component: () => import('../views/goods')
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    children: [
      {
        path: '/',
        meta: { title: '员工管理' },
        component: () => import('../views/staff')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
