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

    <!-- Hero -->
    <section class="organic-gradient min-h-[90vh] flex items-center pt-20 relative">
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <div class="mb-8 px-4 py-1.5 rounded-full border border-slate-200 bg-white/60 text-xs font-medium text-slate-500 tracking-widest uppercase shadow-sm">
          Personal Life Companion
        </div>
        <h1 class="text-5xl md:text-7xl font-semibold leading-tight mb-8 text-slate-800 font-heading tracking-tight">
          让智慧，<br/>回归<span class="italic text-slate-500 font-normal">自然的温度</span>。
        </h1>
        <p class="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          情绪日记、任务管理、时光纪念——LifeBridge 是你的个人生活助手，所有数据安全存储在你的浏览器中。
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <router-link to="/dashboard" class="bg-slate-800 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block">
            立即构建桥梁
          </router-link>
          <a href="#features" class="bg-transparent text-slate-600 px-8 py-4 rounded-full text-base font-medium border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
            了解更多
          </a>
        </div>
      </div>
    </section>

    <!-- 设计理念 -->
    <section id="philosophy" class="py-32 bg-white relative">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-slate-800 font-heading mb-4">设计理念</h2>
          <p class="text-slate-500 max-w-xl text-lg">不追求炫技，只关心你是否用得顺手、用得安心。</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div class="group">
            <div class="h-52 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 mb-8 flex items-center justify-center text-6xl">📉</div>
            <h3 class="text-xl font-medium mb-3 text-slate-800 font-heading">情绪关怀</h3>
            <p class="text-slate-500 leading-relaxed">记录每天的心情变化，AI 作为温暖倾听者给予回应。所有的喜怒哀乐，都值得被看见。</p>
          </div>
          <div class="group">
            <div class="h-52 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 mb-8 flex items-center justify-center text-6xl">✅</div>
            <h3 class="text-xl font-medium mb-3 text-slate-800 font-heading">高效规划</h3>
            <p class="text-slate-500 leading-relaxed">四象限任务板帮你分清轻重缓急，AI 智能优化让每个任务都更具体可执行。</p>
          </div>
          <div class="group">
            <div class="h-52 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 mb-8 flex items-center justify-center text-6xl">🔔</div>
            <h3 class="text-xl font-medium mb-3 text-slate-800 font-heading">时光珍藏</h3>
            <p class="text-slate-500 leading-relaxed">记录人生每个里程碑，时光纪念馆自动计算纪念日，帮你记住每一个重要时刻。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section id="features" class="py-32 bg-[#FDFCF8] relative">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold text-slate-800 font-heading mb-4">功能特性</h2>
          <p class="text-slate-500 max-w-xl text-lg">多维度覆盖你的日常生活，从情绪到效率，一站搞定。</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">📉</div><h3 class="font-bold text-slate-800 mb-2 font-heading">情绪日记</h3><p class="text-sm text-slate-500">记录心情 · AI 倾听回应 · 情绪追踪</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">✅</div><h3 class="font-bold text-slate-800 mb-2 font-heading">四象限任务板</h3><p class="text-sm text-slate-500">重要/紧急分类 · AI 任务优化 · 进度跟踪</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">🔔</div><h3 class="font-bold text-slate-800 mb-2 font-heading">时光纪念馆</h3><p class="text-sm text-slate-500">里程碑记录 · 纪念日提醒 · 图片上传</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">👰</div><h3 class="font-bold text-slate-800 mb-2 font-heading">朋友圈</h3><p class="text-sm text-slate-500">生活瞬间 · 隐私保护 · AI 趣味评论</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">💻</div><h3 class="font-bold text-slate-800 mb-2 font-heading">AI 对话</h3><p class="text-sm text-slate-500">多模型切换 · 对话历史 · 自由交流</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">🧰</div><h3 class="font-bold text-slate-800 mb-2 font-heading">实用工具箱</h3><p class="text-sm text-slate-500">番茄钟 · 计算器 · 起名器 · 习惯打卡</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">🧥</div><h3 class="font-bold text-slate-800 mb-2 font-heading">AI 脑核中心</h3><p class="text-sm text-slate-500">多供应商 API · 本地存储 · 自由切换</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="text-3xl mb-3">🔐</div><h3 class="font-bold text-slate-800 mb-2 font-heading">数据隐私</h3><p class="text-sm text-slate-500">纯前端存储 · 无服务器 · 绝对安全</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于 -->
    <section id="about" class="py-32 bg-white relative">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-semibold text-slate-800 font-heading mb-8">关于 LifeBridge</h2>
        <div class="space-y-6 text-slate-600 leading-relaxed">
          <p>LifeBridge 是一个<strong class="text-slate-800">纯前端个人生活助理</strong>，致力于用 AI 技术温暖地陪伴你的日常生活。</p>
          <p>我们相信，好的工具应该像老朋友一样——<strong class="text-slate-800">懂你、陪你、却从不窥探你的秘密</strong>。</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div class="p-6 bg-[#FDFCF8] rounded-3xl text-center">
              <div class="text-3xl mb-3">🔐</div><h3 class="font-bold text-slate-800 mb-2 font-heading">隐私至上</h3><p class="text-sm text-slate-500">所有数据存储在浏览器的 localStorage 中，不上传任何服务器，你的数据你做主。</p>
            </div>
            <div class="p-6 bg-[#FDFCF8] rounded-3xl text-center">
              <div class="text-3xl mb-3">🧥</div><h3 class="font-bold text-slate-800 mb-2 font-heading">多AI接入</h3><p class="text-sm text-slate-500">支持智谱、DeepSeek、通义千问、豆包、腾讯元宝，可自由切换，API Key 本地存储。</p>
            </div>
            <div class="p-6 bg-[#FDFCF8] rounded-3xl text-center">
              <div class="text-3xl mb-3">🌟</div><h3 class="font-bold text-slate-800 mb-2 font-heading">永续开源</h3><p class="text-sm text-slate-500">基于 Vue 3 + Tailwind CSS 构建，无后端依赖，可自主部署在任何静态托管服务上。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 bg-[#FDFCF8] border-t border-slate-100">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-slate-800 font-heading font-bold text-lg mb-3">LifeBridge<span class="text-slate-400 font-normal">.</span></p>
        <p class="text-slate-400 text-sm">连接科技与日常 · 数据本地存储，隐私无忧 · 61h制作</p>
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
