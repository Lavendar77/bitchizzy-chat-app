import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ApiService from '@/services/api.service'
import '@/plugins/vform'
import '@/plugins/laravel-echo'
import '@/plugins/vue-moment'

ApiService.init();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
