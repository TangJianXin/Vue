import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import axios from 'axios'
Vue.prototype.$http = axios.create({
	baseURL: 'http://localhost:8081/' 
})

Vue.config.productionTip = false;

Vue.use(ElementUI);


new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
