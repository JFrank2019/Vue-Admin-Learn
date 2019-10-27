import Vue from 'vue'
// 引入ElementUI，在App的上面
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入normalize.css、nprogress样式文件
import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(ElementUI)

Vue.config.productionTip = process.env.NODE_ENV === 'production'
// console.log(process.env.VUE_APP_SERVICE_URL)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
