// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { Button, message } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(Button)
app.mount('#app')

app.config.globalProperties.$message = message
