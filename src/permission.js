import router from './router'
import NProgress from 'nprogress'
// 引入获取用户信息的方法
import { getUserInfo } from '@/api/login'

// 关闭右上方的提示
NProgress.configure({ showSpinner: false })

// 全局导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start()

  // 1. 获取token
  const token = localStorage.getItem('vue-admin-token')
  // 1.1 如果没有获取到
  if (!token) {
    // 要访问非登录页面，则不让访问，定向到登录页面 /login
    if (to.path !== '/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    // 1.2 获取到token
    // 1.2.1 请求路由 /login ，那就去目标路由
    if (to.path === '/login') {
      next()
    } else {
      // 1.2.2 请求路由是非登录页面，现在本地查看是否有用户信息
      const userInfo = localStorage.getItem('vue-admin-user')
      if (userInfo) {
        // 本地获取到，则直接让他去目标路由
        next()
      } else {
        // 如果本地没有用户信息，通过token去获取用户信息
        getUserInfo(token).then(res => {
          const resp = res.data
          if (resp.flag) {
            // 如果获取到用户信息，则进行非登录页面，否则回到登录页面
            // 保存到本地
            localStorage.setItem('vue-admin-user', JSON.stringify(resp.data))
            next()
          } else {
            // 未获取到用户信息，重新登录
            next({ path: '/login' })
          }
        })
      }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
