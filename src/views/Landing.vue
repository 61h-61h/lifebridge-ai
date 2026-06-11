<template>
  <div class="antialiased overflow-x-hidden selection:bg-primary-200 selection:text-primary-900 min-h-screen bg-[#FDFCF8] font-body">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <div class="text-xl font-bold tracking-tight text-slate-800 font-heading">
          LifeBridge<span class="text-slate-400 font-normal">.</span>
        </div>
        <div class="hidden md:flex space-x-10 text-sm font-medium text-slate-500">
          <a href="#philosophy" class="hover:text-slate-800 transition-colors">设计理念</a>
          <a href="#features" class="hover:text-slate-800 transition-colors">功能特性</a>
          <a href="#about" class="hover:text-slate-800 transition-colors">关于</a>
        </div>
        <router-link to="/dashboard" class="bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-sm hover:shadow-md">
          开启体验
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="organic-gradient min-h-[90vh] flex items-center pt-20 relative">
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <div class="mb-8 px-4 py-1.5 rounded-full border border-slate-200 bg-white/60 text-xs font-medium text-slate-500 tracking-widest uppercase shadow-sm">
          Next Generation Interface
        </div>
        
        <h1 class="text-5xl md:text-7xl font-semibold leading-tight mb-8 text-slate-800 font-heading tracking-tight">
          让智慧，<br/>回归<span class="italic text-slate-500 font-normal">自然的温度</span>。
        </h1>
        
        <p class="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          LifeBridge 致力于构建隐形而强大的连接。告别冰冷的机器感与浮夸的界面，用细腻、从容的方式，将工具融入你的日常。
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <router-link to="/dashboard" class="bg-slate-800 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block">
            立即构建桥梁
          </router-link>
          <a href="#philosophy" class="bg-transparent text-slate-600 px-8 py-4 rounded-full text-base font-medium border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
            了解更多
          </a>
        </div>
      </div>
    </section>

    <!-- Philosophy Section -->
    <section id="philosophy" class="py-32 bg-white relative">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-20">
          <h2 class="text-3xl md:text-4xl font-semibold text-slate-800 font-heading mb-4">抛弃繁冗，回归本质</h2>
          <p class="text-slate-500 max-w-xl text-lg">好的设计应当像呼吸一样自然。我们重塑了交互的每一个细节。</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div class="group cursor-pointer">
            <div class="h-64 rounded-2xl bg-[#F8F9FA] mb-8 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#F1F3F5]">
              <span class="text-slate-300 text-5xl font-light">01</span>
            </div>
            <h3 class="text-xl font-medium mb-3 text-slate-800">克制的留白</h3>
            <p class="text-slate-500 leading-relaxed font-light">
              去除不必要的边框与装饰线，让内容本身成为视觉的主角。给眼睛休息的空间。
            </p>
          </div>
          
          <div class="group cursor-pointer">
            <div class="h-64 rounded-2xl bg-[#F8F9FA] mb-8 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#F1F3F5]">
              <span class="text-slate-300 text-5xl font-light">02</span>
            </div>
            <h3 class="text-xl font-medium mb-3 text-slate-800">杂志级排版</h3>
            <p class="text-slate-500 leading-relaxed font-light">
              精心挑选的衬线体搭配，让数字阅读也能拥有如同翻阅纸质期刊般的沉静感。
            </p>
          </div>

          <div class="group cursor-pointer">
            <div class="h-64 rounded-2xl bg-[#F8F9FA] mb-8 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#F1F3F5]">
              <span class="text-slate-300 text-5xl font-light">03</span>
            </div>
            <h3 class="text-xl font-medium mb-3 text-slate-800">人类中心主义</h3>
            <p class="text-slate-500 leading-relaxed font-light">
              我们不强调底层的算法有多复杂，只关心它在你手中是否如工具般趁手、自然。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 bg-[#FDFCF8] border-t border-slate-100">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-slate-400 text-sm">
          LifeBridge · 连接科技与日常 · 数据本地存储，隐私无忧 · 61h制作
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
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
