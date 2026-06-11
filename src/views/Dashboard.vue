<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 md:p-10 rounded-3xl shadow-lg">
      <h1 class="text-2xl md:text-3xl font-bold font-heading">{{ greeting.text }}</h1>
      <p class="mt-2 text-white/70 text-sm md:text-base">{{ greeting.sub }}</p>
      <p class="mt-1 text-white/50 text-sm handwritten">{{ today }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="card in stats" :key="card.label" class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer hover:scale-[1.02]" @click="$router.push(card.to)">
        <div class="text-2xl">{{ card.icon }}</div>
        <div class="mt-2 text-2xl font-bold text-slate-800 font-heading">{{ card.value }}</div>
        <div class="text-xs text-slate-400 mt-1">{{ card.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h2 class="font-bold text-slate-800 text-sm font-heading mb-3">📉 最近情绪</h2>
        <div v-if="recentDiaries.length === 0" class="text-sm text-slate-400 py-4 text-center">还没有写过日记，去记录第一篇吧</div>
        <div v-else class="space-y-2">
          <div v-for="d in recentDiaries" :key="d.id" class="p-3 bg-slate-50 rounded-2xl text-sm">
            <div class="flex justify-between"><span class="font-semibold text-slate-700">{{ d.mood }}</span><span class="text-slate-400 handwritten">{{ d.createdAt }}</span></div>
            <p class="text-slate-500 mt-1 line-clamp-2">{{ d.content }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h2 class="font-bold text-slate-800 text-sm font-heading mb-3">✅ 今日待办</h2>
        <div v-if="pendingTasks.length === 0" class="text-sm text-slate-400 py-4 text-center">暂无待办任务</div>
        <div v-else class="space-y-2">
          <div v-for="t in pendingTasks" :key="t.id" class="p-3 bg-slate-50 rounded-2xl text-sm flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="t.quadrant === 'q1' ? 'bg-rose-400' : t.quadrant === 'q2' ? 'bg-amber-400' : t.quadrant === 'q3' ? 'bg-slate-400' : 'bg-slate-400'"></span>
            <span class="text-slate-700">{{ t.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
      <h2 class="font-bold text-slate-800 text-sm font-heading mb-3">🧥 AI 生命洞察</h2>
      <p v-if="aiInsight" class="text-sm text-slate-600 leading-relaxed">{{ aiInsight }}</p>
      <p v-else class="text-sm text-slate-400">点击按钮，让 AI 为你生成今日洞察</p>
      <button @click="generateInsight" :disabled="insightLoading" class="mt-3 px-5 py-2.5 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 hover:scale-[1.02] transition disabled:opacity-50 font-body">
        {{ insightLoading ? 'AI 思考中...' : '✨ 获取今日洞察' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const now = new Date(); const hour = now.getHours();
const greeting = hour < 6 ? { text:'夜深了，生活家 🌙',sub:'好好休息，明天会更好' } : hour < 12 ? { text:'早安，生活家 ☀️',sub:'新的一天，元气满满' } : hour < 14 ? { text:'午安，生活家 ☀️',sub:'中场休息，继续前行' } : hour < 18 ? { text:'下午好，生活家 🌤️',sub:'时光正好，不负韶华' } : { text:'晚安，生活家 🌙',sub:'回顾今日，安然入梦' };
const today = now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
const recentDiaries = computed(() => storage.get(KEYS.DIARIES).slice(0,3));
const pendingTasks = computed(() => storage.get(KEYS.TASKS).filter(t=>!t.done).slice(0,5));
const stats = computed(() => [{icon:'📉',label:'日记篇数',value:storage.get(KEYS.DIARIES).length,to:'/diary'},{icon:'✅',label:'待办任务',value:storage.get(KEYS.TASKS).filter(t=>!t.done).length,to:'/tasks'},{icon:'🔔',label:'里程碑',value:storage.get(KEYS.MILESTONES).length,to:'/timeline'}]);
const aiInsight = ref(''); const insightLoading = ref(false);
const generateInsight = async () => { insightLoading.value=true; try{ const d=storage.get(KEYS.DIARIES).slice(0,5).map(d=>d.content).join('；'); const t=storage.get(KEYS.TASKS).filter(t=>!t.done).map(t=>t.title).join('、'); const r=await askAI({systemPrompt:'你是一个温暖的生活助理，请用一句话给出今天的生活洞察和建议，语气亲切。',userMessage:'最近日记：'+(d||'暂无')+'。待办：'+(t||'暂无')+'。请给我一句话的洞察。'}); aiInsight.value=r; }catch(e){aiInsight.value='⚠️ '+e.message;} insightLoading.value=false; };
</script>