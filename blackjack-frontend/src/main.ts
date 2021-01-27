import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import './assets/styles/bootstrap.min.css'
import './assets/styles/main.less'
import Axios from 'axios'

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$http = Axios
const token = localStorage.getItem('token')
if (token) {
	Vue.prototype.$http.defaults.headers.common.Authorization = token
}
