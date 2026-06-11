<template>
  <div class="antialiased overflow-x-hidden min-h-screen bg-[#FDFCF8] font-body">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold tracking-tight text-slate-800 font-heading hover:text-slate-600 transition">
          LifeBridge<span class="text-slate-400 font-normal">.</span>
        </router-link>
        <div class="hidden md:flex space-x-10 text-sm font-medium text-slate-500">
          <button @click="$router.push({ path: '/info/philosophy' })" :class="activeTab === 'philosophy' ? 'text-slate-800 font-semibold' : 'hover:text-slate-800'" class="transition-colors bg-transparent border-none cursor-pointer">设计理念</button>
          <button @click="$router.push({ path: '/info/features' })" :class="activeTab === 'features' ? 'text-slate-800 font-semibold' : 'hover:text-slate-800'" class="transition-colors bg-transparent border-none cursor-pointer">功能特性</button>
          <button @click="$router.push({ path: '/info/about' })" :class="activeTab === 'about' ? 'text-slate-800 font-semibold' : 'hover:text-slate-800'" class="transition-colors bg-transparent border-none cursor-pointer">关于</button>
        </div>
        <router-link to="/dashboard" class="bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-700 transition-all transform hover:scale-105 shadow-sm hover:shadow-md">
          开启体验
        </router-link>
      </div>
    </nav>

    <!-- Content Area -->
    <div class="pt-24 pb-8">
      <div class="max-w-4xl mx-auto px-6">

        <!-- Mobile tab selector -->
        <div class="md:hidden flex gap-2 mb-10">
          <button v-for="t in tabs" :key="t.key" @click="$router.push({ path: '/info/' + t.key })"
            :class="activeTab === t.key ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200'"
            class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition">{{ t.short }}</button>
        </div>

        <!-- Philosophy Tab -->
        <div v-if="activeTab === 'philosophy'">
          <p class="text-xs text-slate-400 tracking-widest uppercase mb-3">Our Philosophy</p>
          <h1 class="text-4xl md:text-5xl font-semibold text-slate-800 font-heading mb-6">设计理念</h1>
          <p class="text-lg text-slate-500 mb-12 leading-relaxed">不追求炫技，只关心你是否用得顺手、用得安心。LifeBridge 从"人"出发，让科技隐形于日常。</p>

          <div class="space-y-10">
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div class="text-5xl mb-4">📉</div>
              <h2 class="text-2xl font-bold text-slate-800 font-heading mb-3">情绪关怀，而非情绪监控</h2>
              <div class="space-y-3 text-slate-600 leading-relaxed">
                <p>传统的情绪追踪工具像冷冰冰的表格——记录、分类、统计。但情绪不是数据点，情绪是你在深夜失眠时的叹息，是收到好消息时的雀跃。</p>
                <p>LifeBridge 的情绪日记不追踪你、不评判你。AI 作为一位温暖而安静的倾听者，在你需要时给予回应，在你沉默时静静陪伴。你可以选择分享，也可以选择将一切锁在心里——因为数据只存在于你的浏览器中。</p>
              </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div class="text-5xl mb-4">✅</div>
              <h2 class="text-2xl font-bold text-slate-800 font-heading mb-3">高效规划，而非效率焦虑</h2>
              <div class="space-y-3 text-slate-600 leading-relaxed">
                <p>市面上的任务管理工具推崇"极致效率"——但效率的尽头是倦怠。四象限法则的精髓不在于做更多事，而在于做对的事。</p>
                <p>我们的四象限任务板鼓励你识别"重要不紧急"——那些真正塑造你生活的事情。AI 优化不是让你更快，而是让你的任务描述更清晰、更具体、更可执行。拒绝空洞的催促，拥抱有方向的行动。</p>
              </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div class="text-5xl mb-4">🔔</div>
              <h2 class="text-2xl font-bold text-slate-800 font-heading mb-3">时光珍藏，而非数字囤积</h2>
              <div class="space-y-3 text-slate-600 leading-relaxed">
                <p>手机里有成千上万张照片，但你还记得每一张背后的意义吗？时光纪念馆不是另一个云相册，它是你人生的里程碑地图。</p>
                <p>记录一次毕业典礼、一份新工作的第一天、与挚友的重逢。系统自动计算每个里程碑过去的天数，在周年纪念日温柔提醒。不追求数量，只在乎那些真正改变你的瞬间。</p>
              </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div class="text-5xl mb-4">🔐</div>
              <h2 class="text-2xl font-bold text-slate-800 font-heading mb-3">隐私至上，永不作恶</h2>
              <div class="space-y-3 text-slate-600 leading-relaxed">
                <p>LifeBridge 是<strong class="text-slate-800">100% 纯前端应用</strong>。没有后端服务器、没有数据库、没有用户注册。你输入的所有内容——日记、任务、里程碑、对话——都存储在浏览器的 localStorage 中。</p>
                <p>这意味着：没有任何人能访问你的数据。包括我们自己。我们选择放弃"大数据"的便利，换取你绝对的安心。因为你的人生不该成为任何人的商业模型。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Tab -->
        <div v-if="activeTab === 'features'">
          <p class="text-xs text-slate-400 tracking-widest uppercase mb-3">Features</p>
          <h1 class="text-4xl md:text-5xl font-semibold text-slate-800 font-heading mb-6">功能特性</h1>
          <p class="text-lg text-slate-500 mb-12 leading-relaxed">多维度覆盖你的日常生活，从情绪到效率，一站搞定。每一个功能都经过精心打磨，只为给你最自然的体验。</p>

          <div class="space-y-8">
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">📉</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">情绪日记与树洞</h3>
                  <p class="text-slate-500 text-sm mb-3">记录每天的心情变化，选择表情表达此刻感受。写下标题和内容，AI 作为温暖的倾听者以自然亲切的语气回应你、鼓励你。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">8种心情表情</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">AI倾听回应</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">隐私安全</span></div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">✅</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">四象限任务板</h3>
                  <p class="text-slate-500 text-sm mb-3">按照重要与紧急程度将任务分为四个象限。创建任务时可选择是否让 AI 优化任务描述，也可以对已有任务单独请求 AI 优化。勾选完成任务，一目了然。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">四象限分类</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">AI任务优化</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">进度追踪</span></div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">🔔</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">时光纪念馆</h3>
                  <p class="text-slate-500 text-sm mb-3">记录人生中的每一个重要里程碑——职业成就、学业进步、感情节点、健康突破。上传照片，设置日期，系统自动计算距今时间，在周年纪念日发出提醒。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">里程碑记录</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">纪念日提醒</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">图片上传</span></div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">👰</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">朋友圈</h3>
                  <p class="text-slate-500 text-sm mb-3">记录你的生活瞬间。支持公共动态和隐私动态（密码保护），可上传图片，AI 会以风趣幽默的语气给予评论。按全部/公共/隐私筛选查看。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">生活瞬间</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">隐私密码</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">AI趣味评论</span></div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">💻</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">AI 智能对话</h3>
                  <p class="text-slate-500 text-sm mb-3">自由选择5种国内大模型进行对话：智谱清言、DeepSeek、通义千问、字节豆包、腾讯元宝。支持多轮对话、历史记录保存、新建/删除/加载历史对话。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">5种AI模型</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">对话历史</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">自由切换</span></div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div class="flex items-start gap-4">
                <div class="text-4xl shrink-0">🧰</div>
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-slate-800 font-heading mb-2">实用工具箱</h3>
                  <p class="text-slate-500 text-sm mb-3">灵感捕手快速记录一闪而过的想法；番茄专注钟支持自定义时长和专注统计；计算器随时使用；未来时光目标设定倒计时；AI万能起名器生成创意名字；每日习惯打卡追踪。</p>
                  <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">番茄钟</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">计算器</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">起名器</span><span class="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">习惯打卡</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- About Tab -->
        <div v-if="activeTab === 'about'">
          <p class="text-xs text-slate-400 tracking-widest uppercase mb-3">About</p>
          <h1 class="text-4xl md:text-5xl font-semibold text-slate-800 font-heading mb-6">关于 LifeBridge</h1>
          <p class="text-lg text-slate-500 mb-12 leading-relaxed">连接科技与日常的桥梁。由个人打造，为个人服务。</p>

          <div class="space-y-8">
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 class="text-xl font-bold text-slate-800 font-heading mb-4">项目起源</h2>
              <div class="space-y-3 text-slate-600 leading-relaxed">
                <p>LifeBridge 诞生于一个简单的想法：<strong class="text-slate-800">AI 不应该只是生产力工具，它更应该是一个生活伴侣。</strong></p>
                <p>在 AI 热潮中，大多数产品都在追求"更强""更快""更智能"。但我们认为，技术的终极意义不在于它有多复杂，而在于它能否让人的生活变得更好——哪怕只是让一个人在深夜里感受到被倾听。</p>
                <p>LifeBridge 不存储你的数据、不分析你的行为、不推送广告。它只是一个安静的存在，像一座桥梁，连接你与更好的自己。</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl mb-3">🔐</div>
                <h3 class="font-bold text-slate-800 mb-2 font-heading">隐私至上</h3>
                <p class="text-sm text-slate-500">所有数据存储在浏览器的 localStorage 中，不上传任何服务器。你的日记、任务、对话——只有你能看到。</p>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl mb-3">🧥</div>
                <h3 class="font-bold text-slate-800 mb-2 font-heading">多AI接入</h3>
                <p class="text-sm text-slate-500">支持智谱GLM-4-Flash、DeepSeek-Chat、通义千问-Plus、字节豆包、腾讯元宝。自由切换，API Key 本地加密存储。</p>
              </div>
              <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl mb-3">🌟</div>
                <h3 class="font-bold text-slate-800 mb-2 font-heading">永续开源</h3>
                <p class="text-sm text-slate-500">基于 Vue 3 + Vite + Tailwind CSS 构建。无后端依赖，可自行部署在任何静态托管服务上。永远免费，永远属于你。</p>
              </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 class="text-xl font-bold text-slate-800 font-heading mb-4">技术架构</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">前端框架：</strong>Vue 3 (Composition API)</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">构建工具：</strong>Vite 8</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">CSS框架：</strong>Tailwind CSS 3</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">路由：</strong>Vue Router 5 (Hash模式)</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">状态管理：</strong>Pinia</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">存储：</strong>浏览器 localStorage</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">AI接口：</strong>OpenAI兼容API</div>
                <div class="p-3 bg-slate-50 rounded-2xl"><strong class="text-slate-800">部署：</strong>GitHub Pages / Netlify</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-16 bg-[#FDFCF8] border-t border-slate-100">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <router-link to="/" class="text-slate-800 font-heading font-bold text-lg mb-3 block hover:text-slate-600 transition">LifeBridge<span class="text-slate-400 font-normal">.</span></router-link>
        <p class="text-slate-400 text-sm">连接科技与日常 · 数据本地存储，隐私无忧 · 61h制作</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const activeTab = ref(route.params.tab || 'philosophy');
watch(() => route.params.tab, (newTab) => { if (newTab) activeTab.value = newTab; });
const tabs = [
  { key: 'philosophy', short: '设计理念' },
  { key: 'features', short: '功能特性' },
  { key: 'about', short: '关于' },
];
</script>

<style scoped>
.glass-nav {
  background: rgba(253, 252, 248, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,0,0,0.03);
}
</style>
