<template>
  <div class="antialiased overflow-x-hidden selection:bg-primary-200 selection:text-primary-900 min-h-screen bg-[#FDFCF8] font-body">

    <nav class="fixed w-full z-50 glass-nav transition-all duration-300">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
        <div class="text-lg md:text-xl font-bold tracking-tight text-slate-800 font-heading">
          LifeBridge<span class="text-slate-400 font-normal">.</span>
        </div>
        <!-- Desktop nav -->
        <div class="hidden md:flex space-x-10 text-sm font-medium text-slate-500">
          <router-link to="/info/philosophy" class="hover:text-slate-800 transition-colors">设计理念</router-link>
          <router-link to="/info/features" class="hover:text-slate-800 transition-colors">功能特性</router-link>
          <router-link to="/info/about" class="hover:text-slate-800 transition-colors">关于</router-link>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="bg-slate-800 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap">
            开启体验
          </router-link>
          <!-- Mobile hamburger -->
          <button @click="menuOpen = !menuOpen" class="md:hidden text-slate-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <span v-if="!menuOpen" class="text-xl">☰</span>
            <span v-else class="text-xl">✕</span>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="menuOpen" class="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-2">
        <router-link to="/info/philosophy" @click="menuOpen=false" class="block py-3 px-4 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">设计理念</router-link>
        <router-link to="/info/features" @click="menuOpen=false" class="block py-3 px-4 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">功能特性</router-link>
        <router-link to="/info/about" @click="menuOpen=false" class="block py-3 px-4 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">关于</router-link>
      </div>
    </nav>

    <section class="organic-gradient min-h-[85vh] md:min-h-[90vh] flex items-center pt-16 md:pt-20 relative">
      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
        <div class="mb-6 md:mb-8 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-slate-200 bg-white/60 text-[10px] md:text-xs font-medium text-slate-500 tracking-widest uppercase shadow-sm">
          Personal Life Companion
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-7xl font-semibold leading-tight mb-6 md:mb-8 text-slate-800 font-heading tracking-tight">
          让智慧，<br/>回归<span class="italic text-slate-500 font-normal">自然的温度</span>。
        </h1>
        <p class="text-base md:text-xl text-slate-500 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2">
          情绪日记、任务管理、时光纪念——LifeBridge 是你的个人生活助手，所有数据安全存储在你的浏览器中。
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full sm:w-auto">
          <router-link to="/dashboard" class="bg-slate-800 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full text-sm md:text-base font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block">
            立即构建桥梁
          </router-link>
          <router-link to="/info/features" class="bg-transparent text-slate-600 px-6 md:px-8 py-3.5 md:py-4 rounded-full text-sm md:text-base font-medium border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
            了解更多
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-32 bg-white relative">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="mb-10 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-4">
          <div>
            <h2 class="text-2xl md:text-4xl font-semibold text-slate-800 font-heading mb-2 md:mb-4">设计理念</h2>
            <p class="text-slate-500 max-w-xl text-sm md:text-lg">不追求炫技，只关心你是否用得顺手、用得安心。</p>
          </div>
          <router-link to="/info/philosophy" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition whitespace-nowrap">深入了解 →</router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div v-for="card in philosophyCards" :key="card.title" class="group">
            <div class="h-40 md:h-52 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 mb-5 md:mb-8 flex items-center justify-center text-4xl md:text-6xl"><component :is="card.icon" :size="48" class="md:w-[60px] md:h-[60px]" /></div>
            <h3 class="text-lg md:text-xl font-medium mb-2 md:mb-3 text-slate-800 font-heading">{{ card.title }}</h3>
            <p class="text-slate-500 leading-relaxed text-sm md:text-base">{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-32 bg-[#FDFCF8] relative">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="mb-10 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-4">
          <div>
            <h2 class="text-2xl md:text-4xl font-semibold text-slate-800 font-heading mb-2 md:mb-4">功能特性</h2>
            <p class="text-slate-500 max-w-xl text-sm md:text-lg">多维度覆盖你的日常生活，从情绪到效率，一站搞定。</p>
          </div>
          <router-link to="/info/features" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition whitespace-nowrap">查看全部功能 →</router-link>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div v-for="f in features" :key="f.title" class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="mb-2 md:mb-3"><component :is="f.icon" :size="24" class="md:w-7 md:h-7 text-slate-500" /></div>
            <h3 class="font-bold text-slate-800 mb-1 md:mb-2 font-heading text-xs md:text-base">{{ f.title }}</h3>
            <p class="text-[10px] md:text-sm text-slate-500">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-32 bg-white relative">
      <div class="max-w-4xl mx-auto px-4 md:px-6">
        <div class="mb-10 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-4">
          <div>
            <h2 class="text-2xl md:text-4xl font-semibold text-slate-800 font-heading mb-2 md:mb-4">关于 LifeBridge</h2>
            <p class="text-slate-500 max-w-xl text-sm md:text-lg">连接科技与日常的桥梁。</p>
          </div>
          <router-link to="/info/about" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition whitespace-nowrap">了解更多 →</router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div class="p-4 md:p-6 bg-[#FDFCF8] rounded-2xl md:rounded-3xl text-center">
            <div class="text-2xl md:text-3xl mb-2 md:mb-3">🔐</div>
            <h3 class="font-bold text-slate-800 mb-1 md:mb-2 font-heading text-sm md:text-base">隐私至上</h3>
            <p class="text-xs md:text-sm text-slate-500">所有数据存储在浏览器的 localStorage 中，不上传任何服务器。</p>
          </div>
          <div class="p-4 md:p-6 bg-[#FDFCF8] rounded-2xl md:rounded-3xl text-center">
            <div class="text-2xl md:text-3xl mb-2 md:mb-3">🧥</div>
            <h3 class="font-bold text-slate-800 mb-1 md:mb-2 font-heading text-sm md:text-base">多AI接入</h3>
            <p class="text-xs md:text-sm text-slate-500">智谱、DeepSeek、通义千问、豆包、腾讯元宝自由切换。</p>
          </div>
          <div class="p-4 md:p-6 bg-[#FDFCF8] rounded-2xl md:rounded-3xl text-center">
            <div class="text-2xl md:text-3xl mb-2 md:mb-3">🌟</div>
            <h3 class="font-bold text-slate-800 mb-1 md:mb-2 font-heading text-sm md:text-base">永续开源</h3>
            <p class="text-xs md:text-sm text-slate-500">Vue 3 + Tailwind CSS，无后端依赖，永久免费。</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-10 md:py-16 bg-[#FDFCF8] border-t border-slate-100">
      <div class="max-w-6xl mx-auto px-4 md:px-6 text-center">
        <p class="text-slate-800 font-heading font-bold text-base md:text-lg mb-2 md:mb-3">LifeBridge<span class="text-slate-400 font-normal">.</span></p>
        <p class="text-slate-400 text-xs md:text-sm">连接科技与日常 · 数据本地存储，隐私无忧 · 61h制作</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { BookHeart, CheckSquare, Clock, Users, MessageCircle, Wrench, Cpu, Shield, Sparkles, Heart } from 'lucide-vue-next';
import { ref } from 'vue';
const menuOpen = ref(false);
const philosophyCards = [
  { icon: BookHeart, title:'情绪关怀', desc:'记录每天的心情变化，AI 作为温暖倾听者给予回应。所有的喜怒哀乐，都值得被看见。' },
  { icon: CheckSquare, title:'高效规划', desc:'四象限任务板帮你分清轻重缓急，AI 智能优化让每个任务都更具体可执行。' },
  { icon: Clock, title:'时光珍藏', desc:'记录人生每个里程碑，时光纪念馆自动计算纪念日，帮你记住每一个重要时刻。' },
];
const features = [
  { icon: BookHeart, title:'情绪日记', desc:'记录心情 · AI 倾听回应 · 情绪追踪' },
  { icon: CheckSquare, title:'四象限任务板', desc:'重要/紧急分类 · AI 任务优化 · 进度跟踪' },
  { icon: Clock, title:'时光纪念馆', desc:'里程碑记录 · 纪念日提醒 · 图片上传' },
  { icon: Users, title:'朋友圈', desc:'生活瞬间 · 隐私保护 · AI 趣味评论' },
  { icon: MessageCircle, title:'AI 对话', desc:'多模型切换 · 对话历史 · 自由交流' },
  { icon: Wrench, title:'实用工具箱', desc:'番茄钟 · 计算器 · 起名器 · 习惯打卡' },
  { icon: Cpu, title:'AI 脑核中心', desc:'多供应商 API · 本地存储 · 自由切换' },
  { icon: Shield, title:'数据隐私', desc:'纯前端存储 · 无服务器 · 绝对安全' },
];
</script>

<style scoped>
.glass-nav {
  background: rgba(253, 252, 248, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,0,0,0.03);
}
.organic-gradient {
  background: radial-gradient(circle at 15% 50%, rgba(226, 232, 240, 0.4), transparent 25%),
              radial-gradient(circle at 85% 30%, rgba(241, 245, 249, 0.5), transparent 25%);
}
</style>
