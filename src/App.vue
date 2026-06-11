<template>
  <div class="flex flex-col md:flex-row h-dvh bg-warmer-50 overflow-hidden">

    <!-- Mobile header -->
    <header class="md:hidden flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 py-3 shrink-0 z-20 border-b border-warmer-200">
      <h1 class="text-base font-bold text-navy-500 font-heading">LifeBridge</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-navy-500 p-1">
        <span v-if="!mobileMenuOpen" class="text-xl">?</span>
        <span v-else class="text-xl">?</span>
      </button>
    </header>

    <!-- Mobile overlay -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-navy-500/30 backdrop-blur-sm z-30" @click="mobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="w-64 bg-navy-500 text-white flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0">
      <div class="p-5 border-b border-white/10">
        <div class="w-10 h-10 bg-coral-400 rounded-2xl flex items-center justify-center text-white text-lg">??</div>
        <div class="mt-3 text-base font-bold font-heading">LifeBridge</div>
        <div class="text-xs text-white/50 mt-0.5">????????</div>
      </div>
      <nav class="flex-1 py-3 space-y-0.5 px-3 overflow-y-auto" @click="mobileMenuOpen = false">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-300"
          :class="[$route.path === item.path ? 'bg-white/12 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/6']">
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-white/10 text-center text-[10px] text-white/40">
        100% ??? ? ?????? ? 61h??
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0 min-h-0">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Mobile bottom nav -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-warmer-200 flex justify-around py-1.5 z-30 safe-bottom">
      <router-link v-for="item in bottomNavItems" :key="item.path" :to="item.path"
        class="flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-[10px] transition-colors min-w-0"
        :class="$route.path === item.path ? 'text-navy-500' : 'text-subtle'">
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
  { path:'/',label:'???',icon:'??'},{ path:'/diary',label:'????',icon:'??'},{ path:'/tasks',label:'???',icon:'??'},{ path:'/timeline',label:'?????',icon:'???'},{ path:'/moments',label:'???',icon:'??'},{ path:'/tools',label:'?????',icon:'??'},{ path:'/chat',label:'AI ??',icon:'??'},{ path:'/settings',label:'AI ????',icon:'??'},
];
const bottomNavItems = [
  { path:'/',label:'???',icon:'??'},{ path:'/diary',label:'??',icon:'??'},{ path:'/tasks',label:'??',icon:'??'},{ path:'/chat',label:'AI',icon:'??'},{ path:'/moments',label:'???',icon:'??'},
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