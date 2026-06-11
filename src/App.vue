<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">

    <!-- 手机端顶部栏 -->
    <header class="md:hidden flex items-center justify-between bg-white px-4 py-3 shrink-0 z-20 border-b border-slate-100">
      <h1 class="text-base font-bold text-slate-800">🌉 LifeBridge</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-600 p-1">
        <span v-if="!mobileMenuOpen" class="text-xl">☰</span>
        <span v-else class="text-xl">✕</span>
      </button>
    </header>

    <!-- 手机端遮罩 -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-black/40 z-30" @click="mobileMenuOpen = false"></div>

    <!-- 侧边栏 -->
    <aside
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0">
      <div class="p-5 border-b border-slate-100">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg">🌉</div>
        <div class="mt-3 text-sm font-bold text-slate-800">LifeBridge AI</div>
        <div class="text-[10px] text-slate-400 mt-0.5">个人生活助理空间</div>
      </div>
      <nav class="flex-1 py-3 space-y-0.5 px-3 overflow-y-auto" @click="mobileMenuOpen = false">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300"
          :class="[$route.path === item.path ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']">
          <span v-html="item.icon"></span>
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
        100% 纯前端 · 数据本地存储 · 61h制作
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-y-auto pb-16 md:pb-0">
      <div class="max-w-6xl mx-auto p-4 md:p-10">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 手机端底部导航 -->
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
.nav-link:active { transform: scale(0.96); }
.safe-bottom { padding-bottom: calc(0.375rem + env(safe-area-inset-bottom, 0px)); }
.fade-enter-active { transition: all 0.25s ease; }
.fade-leave-active { transition: all 0.15s ease; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>