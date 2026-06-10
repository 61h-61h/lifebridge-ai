<template>
  <div class="p-8 space-y-6">
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-lg">
      <h1 class="text-3xl font-black">早安，生活家 🌅</h1>
      <p class="mt-2 text-white/80 text-sm">{{ today }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="card in stats" :key="card.label" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer" @click="$router.push(card.to)">
        <div class="text-2xl">{{ card.icon }}</div>
        <div class="mt-2 text-2xl font-black text-slate-800">{{ card.value }}</div>
        <div class="text-xs text-slate-400 mt-1">{{ card.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 class="font-bold text-slate-700 text-sm mb-3">📖 最近情绪</h2>
        <div v-if="recentDiaries.length === 0" class="text-xs text-slate-400 py-4 text-center">还没有写过日记，去记录第一篇吧</div>
        <div v-else class="space-y-2">
          <div v-for="d in recentDiaries" :key="d.id" class="p-3 bg-slate-50 rounded-xl text-xs">
            <div class="flex justify-between">
              <span class="font-semibold text-slate-700">{{ d.mood }}</span>
              <span class="text-slate-400">{{ d.createdAt }}</span>
            </div>
            <p class="text-slate-500 mt-1 line-clamp-2">{{ d.content }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 class="font-bold text-slate-700 text-sm mb-3">✅ 今日待办</h2>
        <div v-if="pendingTasks.length === 0" class="text-xs text-slate-400 py-4 text-center">暂无待办任务</div>
        <div v-else class="space-y-2">
          <div v-for="t in pendingTasks" :key="t.id" class="p-3 bg-slate-50 rounded-xl text-xs flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="priorityColor(t.priority)"></span>
            <span class="text-slate-700">{{ t.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h2 class="font-bold text-slate-700 text-sm mb-3">🧠 AI 生命洞察</h2>
      <p v-if="aiInsight" class="text-sm text-slate-600 leading-relaxed">{{ aiInsight }}</p>
      <p v-else class="text-xs text-slate-400">点击按钮，让 AI 为你生成今日洞察</p>
      <button @click="generateInsight" :disabled="insightLoading" class="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
        {{ insightLoading ? 'AI 思考中...' : '✨ 获取今日洞察' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage, KEYS } from '../services/storage';
import { askAI } from '../services/ai';

const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

const recentDiaries = computed(() => storage.get(KEYS.DIARIES).slice(0, 3));
const pendingTasks = computed(() => storage.get(KEYS.TASKS).filter(t => !t.done).slice(0, 5));

const stats = computed(() => [
  { icon: '📖', label: '日记篇数', value: storage.get(KEYS.DIARIES).length, to: '/diary' },
  { icon: '✅', label: '待办任务', value: storage.get(KEYS.TASKS).filter(t => !t.done).length, to: '/tasks' },
  { icon: '⏳', label: '里程碑', value: storage.get(KEYS.MILESTONES).length, to: '/timeline' },
]);

const priorityColor = (p) => {
  const map = { urgent: 'bg-red-500', important: 'bg-yellow-500', normal: 'bg-green-500', low: 'bg-blue-500' };
  return map[p] || 'bg-slate-400';
};

const aiInsight = ref('');
const insightLoading = ref(false);

const generateInsight = async () => {
  insightLoading.value = true;
  try {
    const diaries = storage.get(KEYS.DIARIES).slice(0, 5).map(d => d.content).join('；');
    const tasks = storage.get(KEYS.TASKS).filter(t => !t.done).map(t => t.title).join('、');
    const res = await askAI({
      systemPrompt: '你是一个温暖的生活助理，请用一句话给出今天的生活洞察和建议，语气亲切。',
      userMessage: `我的最近日记：${diaries || '暂无'}。我的待办：${tasks || '暂无'}。请给我一句话的洞察。`
    });
    aiInsight.value = res;
  } catch (e) {
    aiInsight.value = '⚠️ ' + e.message;
  }
  insightLoading.value = false;
};
</script>
