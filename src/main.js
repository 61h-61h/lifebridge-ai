import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

import Dashboard from './views/Dashboard.vue'
import Diary from './views/Diary.vue'
import Tasks from './views/Tasks.vue'
import Timeline from './views/Timeline.vue'
import Moments from './views/Moments.vue'
import Tools from './views/Tools.vue'
import Chat from './views/Chat.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/diary', component: Diary },
  { path: '/tasks', component: Tasks },
  { path: '/timeline', component: Timeline },
  { path: '/moments', component: Moments },
  { path: '/tools', component: Tools },
  { path: '/chat', component: Chat },
  { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
