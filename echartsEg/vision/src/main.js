import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import SocketService from './utils/socket_service'
//导入全局css
import '../src/assets/css/global.css'
//引入字体文件
import '@/assets/font/iconfont.css'
//echarts插件在index页面导入，变成了window.echarts
//通过这一步可以实现echarts变为全局对象，在其他组件中可用this.$echarts表示
SocketService.Instance.connect()
Vue.prototype.$echarts = window.echarts
Vue.prototype.$socket = SocketService.Instance
axios.defaults.baseURL = 'http://127.0.0.1:3344/api/'
//挂载  在其他组件中，用this.$http
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
