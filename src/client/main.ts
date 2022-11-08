import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap-polaris/dist/main.css';

createApp(App).use(router).mount('#app')