const fs = require("fs");

// ===== App.vue =====
fs.writeFileSync("src/App.vue", `<template>
  <div class="flex flex-col md:flex-row h-dvh bg-warmer-50 overflow-hidden">

    <header class="md:hidden flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 py-3 shrink-0 z-20 border-b border-warmer-200">
      <h1 class="text-base font-bold text-navy-500 font-heading">LifeBridge</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-navy-500 p-1">
        <span v-if="!mobileMenuOpen" class="text-xl">\u2630</span>
        <span v-else class="text-xl">\u2715</span>
      </button>
    </header>

    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 bg-navy-500/30 backdrop-blur-sm z-30" @click="mobileMenuOpen = false"></div>

    <aside
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="w-64 bg-navy-500 text-white flex flex-col shrink-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0">
      <div class="p-5 border-b border-white/10">
        <div class="w-10 h-10 bg-coral-400 rounded-2xl flex items-center justify-center text-white text-lg">\ud83c\udf09</div>
        <div class="mt-3 text-base font-bold font-heading">LifeBridge</div>
        <div class="text-xs text-white/50 mt-0.5">\u4e2a\u4eba\u751f\u6d3b\u52a9\u7406\u7a7a\u95f4</div>
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
        100% \u7eaf\u524d\u7aef \u00b7 \u6570\u636e\u672c\u5730\u5b58\u50a8 \u00b7 61h\u5236\u4f5c
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0 min-h-0">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

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
  { path:'/',label:'\u4e3b\u63a7\u53f0',icon:'\ud83c\udf3f'},{ path:'/diary',label:'\u60c5\u7eea\u65e5\u8bb0',icon:'\ud83c\udf38'},{ path:'/tasks',label:'\u4efb\u52a1\u677f',icon:'\ud83c\udf31'},{ path:'/timeline',label:'\u65f6\u5149\u7eaa\u5ff5\u9986',icon:'\ud83d\udd6f\ufe0f'},{ path:'/moments',label:'\u670b\u53cb\u5708',icon:'\ud83c\udf3c'},{ path:'/tools',label:'\u5b9e\u7528\u5de5\u5177\u7bb1',icon:'\ud83d\udd27'},{ path:'/chat',label:'AI \u5bf9\u8bdd',icon:'\ud83d\udcac'},{ path:'/settings',label:'AI \u8111\u6838\u4e2d\u5fc3',icon:'\u2699\ufe0f'},
];
const bottomNavItems = [
  { path:'/',label:'\u4e3b\u63a7\u53f0',icon:'\ud83c\udf3f'},{ path:'/diary',label:'\u65e5\u8bb0',icon:'\ud83c\udf38'},{ path:'/tasks',label:'\u4efb\u52a1',icon:'\ud83c\udf31'},{ path:'/chat',label:'AI',icon:'\ud83d\udcac'},{ path:'/moments',label:'\u670b\u53cb\u5708',icon:'\ud83c\udf3c'},
];
<\/script>

<style scoped>
.nav-link:active { transform: scale(0.96); }
.safe-bottom { padding-bottom: calc(0.375rem + env(safe-area-inset-bottom, 0px)); }
.fade-enter-active { transition: all 0.25s ease; }
.fade-leave-active { transition: all 0.15s ease; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>`);

console.log("App.vue done");