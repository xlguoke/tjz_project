import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import App from './App.vue'
import { createTypedRouter } from './router.ts'
import './assets/styles/base.css'
import './assets/styles/ant-extend.css'
import directive from './directive/index.ts'

// pinia数据持久化插件

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

const router = createTypedRouter()

const head = createHead()

app.use(directive)
app.use(router)
app.use(pinia)
app.use(head)
app.mount('#app')
