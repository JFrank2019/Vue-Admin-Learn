import router from './router'
import store from './store'
import NProgress from 'nprogress'
// 引入获取用户信息的方法
// import { getUserInfo } from '@/api/login'

// 关闭右上方的提示
NProgress.configure({ showSpinner: false })

// 全局导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start()

  // 1. 获取token
  // const token = localStorage.getItem('vue-admin-token')
  const token = store.state.user.token
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
      // const userInfo = localStorage.getItem('vue-admin-user')
      const userInfo = store.state.user.user

      if (userInfo) {
        console.log('拿到userinfo，去目标路由')
        // 本地获取到，则直接让他去目标路由
        next()
      } else {
        console.log('没有拿到目标信息')
        // 如果本地没有用户信息，通过token去获取用户信息
        store
          .dispatch('GetUserInfo')
          .then(response => {
            if (response.flag) {
              next()
            } else {
              next({ path: '/login' })
            }
          })
          .catch()
      }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
