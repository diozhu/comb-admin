import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import './registerServiceWorker';
import './plugins/element.js';
import './plugins/theme.js';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
