<template>
  <div class="flex flex-col md:flex-row h-dvh md:h-screen bg-slate-50 overflow-hidden">

    <!-- 手机端顶部栏 -->
    <header class="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 shrink-0 z-20">
      <h1 class="text-base font-black tracking-wide">🌉 LifeBridge</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white p-1">
        <span v-if="!mobileMenuOpen" class="text-xl">☰</span>
        <span v-else class="text-xl">✕</span>
      </button>
    </header>

    <!-- 手机端侧边栏遮罩 -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-black/50 z-30" @click="mobileMenuOpen = false"></div>

    <!-- 侧边栏 -->
    <aside 
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="w-60 bg-slate-900 text-white flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0">
      <div class="hidden md:block p-5 border-b border-slate-700">
        <h1 class="text-lg font-black tracking-wide">🌉 LifeBridge</h1>
        <p class="text-[10px] text-slate-400 mt-0.5">AI 个人生活助理空间</p>
      </div>
      <div class="md:hidden p-4 border-b border-slate-700">
        <h1 class="text-lg font-black tracking-wide">🌉 LifeBridge</h1>
        <p class="text-[10px] text-slate-400 mt-0.5">AI 个人生活助理空间</p>
      </div>
      <nav class="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto" @click="mobileMenuOpen = false">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="nav-link flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm relative overflow-hidden"
          :class="[$route.path === item.path ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5']">
          <span v-html="item.icon"></span>
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-700 text-center text-[10px] text-slate-500">
        100% 纯前端 · 数据本地存储 · 61h制作
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-y-auto pb-16 md:pb-0 min-h-0">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 手机端底部导航栏 -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around py-1.5 z-30 safe-bottom">
      <router-link v-for="item in bottomNavItems" :key="item.path" :to="item.path"
        class="flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-[10px] transition-colors min-w-0"
        :class="$route.path === item.path ? 'text-indigo-600' : 'text-slate-400'">
        <span class="text-lg">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const navItems = [
  { path: '/', label: '主控台', icon: '🏠' },
  { path: '/diary', label: '情绪日记', icon: '📖' },
  { path: '/tasks', label: '任务板', icon: '✅' },
  { path: '/timeline', label: '时光纪念馆', icon: '⏳' },
  { path: '/moments', label: '朋友圈', icon: '💬' },
  { path: '/tools', label: '实用工具箱', icon: '🧰' },
  { path: '/chat', label: 'AI 对话', icon: '🤖' },
  { path: '/settings', label: 'AI 脑核中心', icon: '🧠' },
];

const bottomNavItems = [
  { path: '/', label: '主控台', icon: '🏠' },
  { path: '/diary', label: '日记', icon: '📖' },
  { path: '/tasks', label: '任务', icon: '✅' },
  { path: '/chat', label: 'AI', icon: '🤖' },
  { path: '/moments', label: '朋友圈', icon: '💬' },
];
</script>

<style scoped>
/* 侧边栏链接动画 */
.nav-link {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-link:active {
  transform: scale(0.96);
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 0;
  height: 2px;
  background: rgba(255,255,255,0.5);
  border-radius: 1px;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}
.nav-link:hover::after {
  width: 40%;
}
.nav-link.router-link-active::after {
  width: 50%;
  background: rgba(255,255,255,0.8);
}

/* 底部安全区适配 */
.safe-bottom {
  padding-bottom: calc(0.375rem + env(safe-area-inset-bottom, 0px));
}

/* 页面切换动画 */
.page-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>