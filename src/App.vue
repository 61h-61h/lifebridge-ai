<template>
  <div v-if="isStandalone" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <div v-else class="flex flex-col md:flex-row h-dvh overflow-hidden bg-[#FDFCF8]">

    <header class="md:hidden flex items-center justify-between bg-white px-4 py-3 shrink-0 z-20 border-b border-slate-100">
      <h1 class="text-sm font-bold text-slate-800 font-heading">LifeBridge</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
        <Menu v-if="!mobileMenuOpen" :size="20" />
        <X v-else :size="20" />
      </button>
    </header>

    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-black/40 z-30" @click="mobileMenuOpen = false"></div>

    <aside
      :class="[mobileMenuOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0']"
      class="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300">
      <div class="p-5 border-b border-slate-100">
        <div class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white">
          <Sparkles :size="18" />
        </div>
        <div class="mt-3 text-sm font-bold text-slate-800 font-heading">LifeBridge AI</div>
        <div class="text-[11px] text-slate-400 mt-0.5">个人生活助理空间</div>
      </div>
      <nav class="flex-1 py-2 space-y-0.5 px-3 overflow-y-auto" @click="mobileMenuOpen = false">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 min-h-[44px]"
          :class="[route.path === item.path ? 'bg-slate-100 text-slate-700 font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100']">
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
        100% 纯前端 · 数据本地存储 · 61h制作
      </div>
    </aside>

    <main v-if="isChat" class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div class="flex-1 flex flex-col min-h-0 p-2 md:p-4">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <main v-else class="flex-1 overflow-y-auto min-h-0 pb-20 md:pb-0">
      <div class="max-w-6xl mx-auto px-3 py-4 md:p-10">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around py-1 z-30 safe-bottom">
      <router-link v-for="item in bottomNavItems" :key="item.path" :to="item.path"
        class="flex flex-col items-center justify-center gap-0.5 px-0.5 py-0.5 rounded-lg text-[10px] transition-colors min-w-[44px] min-h-[44px]"
        :class="[route.path === item.path ? 'text-slate-700' : 'text-slate-400']">
        <component :is="item.icon" :size="18" />
        <span class="truncate max-w-[48px]">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboard, BookHeart, CheckSquare, Clock, Users, Wrench, MessageCircle, Cpu, Sparkles, Menu, X } from 'lucide-vue-next';
const route = useRoute();
const mobileMenuOpen = ref(false);
const isStandalone = computed(() => route.path === '/' || route.path.startsWith('/info'));
const isChat = computed(() => route.path === '/chat');
const navItems = [
  { path:'/dashboard', label:'主控台', icon: LayoutDashboard },
  { path:'/diary', label:'情绪日记', icon: BookHeart },
  { path:'/tasks', label:'任务板', icon: CheckSquare },
  { path:'/timeline', label:'时光纪念馆', icon: Clock },
  { path:'/moments', label:'朋友圈', icon: Users },
  { path:'/tools', label:'实用工具箱', icon: Wrench },
  { path:'/chat', label:'AI 对话', icon: MessageCircle },
  { path:'/settings', label:'AI 脑核中心', icon: Cpu },
];
const bottomNavItems = [
  { path:'/dashboard', label:'主控台', icon: LayoutDashboard },
  { path:'/diary', label:'日记', icon: BookHeart },
  { path:'/tasks', label:'任务', icon: CheckSquare },
  { path:'/chat', label:'AI', icon: MessageCircle },
  { path:'/moments', label:'朋友圈', icon: Users },
];
</script>

<style scoped>
.nav-link:active { transform: scale(0.97); }
.safe-bottom { padding-bottom: calc(0.25rem + env(safe-area-inset-bottom, 0px)); }
</style>
