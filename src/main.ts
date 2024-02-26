// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { Input, Button, message, Spin, Progress } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

const components = [Input, Button, Spin, Progress]
components.forEach((component) => {
  app.use(component)
})

app.mount('#get-weibo-reply')

app.config.globalProperties.$message = message
