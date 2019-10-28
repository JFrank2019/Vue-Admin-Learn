import axios from 'axios'
import NProgress from 'nprogress'
import { Message, Loading } from 'element-ui'

const loading = {
  loadingInstance: null, // Loading 实例
  // 打开加载
  open: function() {
    // 创建实例,而且会打开加载 窗口
    console.log(this.loadingInstance, 'loadingInstance')
    if (this.loadingInstance === null) {
      // 如果实例 为空，则创建
      console.log('创建加载实例。。。')
      this.loadingInstance = Loading.service({
        target: '.main',
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    }
  },
  // 关闭加载
  close: function() {
    // 不为空时, 则关闭加载窗口
    if (this.loadingInstance !== null) {
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  }
}

// 取消右上方的圆圈
NProgress.configure({ showSpinner: false })

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    NProgress.start()
    // 打开加载窗口
    loading.open()
    return config
  },
  error => {
    // 关闭加载窗口
    loading.close()
    // 出现异常
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const resp = response.data
    if (resp.code !== 2000) {
      Message({
        message: resp.message || '系统异常',
        type: 'warning'
      })
    }
    NProgress.done()
    // 关闭加载窗口
    loading.close()
    return response
  },
  error => {
    NProgress.done()
    // 关闭加载窗口
    loading.close()
    Message.error({
      message: error.message,
      type: 'error'
    })

    return Promise.reject(error)
  }
)

export default request
