<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <aside class="w-60 bg-slate-900 text-white flex flex-col shrink-0">
      <div class="p-5 border-b border-slate-700">
        <h1 class="text-lg font-black tracking-wide">🌉 LifeBridge</h1>
        <p class="text-[10px] text-slate-400 mt-0.5">AI 个人生活助理空间</p>
      </div>
      <nav class="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
          :class="[$route.path === item.path ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5']">
          <span v-html="item.icon"></span>
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-700 text-center text-[10px] text-slate-500">
        100% 纯前端 · 数据本地存储 · 61h制作
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
const navItems = [
  { path: '/', label: '主控台', icon: '🏠' },
  { path: '/diary', label: '情绪日记', icon: '📖' },
  { path: '/tasks', label: '任务板', icon: '✅' },
  { path: '/timeline', label: '时光纪念馆', icon: '⏳' },
  { path: '/moments', label: '朋友圈', icon: '💬' },
  { path: '/tools', label: '实用工具箱', icon: '🧰' },
  { path: '/chat', label: 'AI 对话', icon: '🤖' },
  { path: '/settings', label: 'AI 脑核中心', icon: '🧠' },
]
</script>


<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
