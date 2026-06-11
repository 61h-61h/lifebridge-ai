<template>
  <div class="p-4 md:p-8 space-y-4 md:space-y-6">
    <div class="bg-gradient-to-br from-kinpaku/20 to-patina/10 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-hairline-strong">
      <h1 class="text-2xl md:text-3xl text-champagne font-display font-semibold tracking-tight">{{ greeting.text }}</h1>
      <p class="mt-1 text-text-muted text-xs md:text-sm">{{ greeting.sub }}</p>
      <p class="mt-0.5 text-text-faint text-[10px] md:text-xs font-mono">{{ today }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="card in stats" :key="card.label" class="card p-5 hover:border-hairline-strong transition cursor-pointer" @click="$router.push(card.to)">
        <div class="text-2xl">{{ card.icon }}</div>
        <div class="mt-2 text-2xl text-champagne font-display font-semibold">{{ card.value }}</div>
        <div class="text-xs text-text-faint mt-1">{{ card.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card p-5">
        <h2 class="text-champagne text-sm mb-3 font-body font-semibold">📖 最近情绪</h2>
        <div v-if="recentDiaries.length === 0" class="text-xs text-text-faint py-4 text-center">还没有写过日记，去记录第一篇吧</div>
        <div v-else class="space-y-2">
          <div v-for="d in recentDiaries" :key="d.id" class="p-3 bg-lacquer rounded-xl text-xs border border-hairline">
            <div class="flex justify-between">
              <span class="text-text-warm font-semibold">{{ d.mood }}</span>
              <span class="text-text-faint">{{ d.createdAt }}</span>
            </div>
            <p class="text-text-muted mt-1 line-clamp-2">{{ d.content }}</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <h2 class="text-champagne text-sm mb-3 font-body font-semibold">✅ 今日待办</h2>
        <div v-if="pendingTasks.length === 0" class="text-xs text-text-faint py-4 text-center">暂无待办任务</div>
        <div v-else class="space-y-2">
          <div v-for="t in pendingTasks" :key="t.id" class="p-3 bg-lacquer rounded-xl text-xs flex items-center gap-2 border border-hairline">
            <span class="w-2 h-2 rounded-full" :class="priorityColor(t.priority)"></span>
            <span class="text-text-warm">{{ t.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h2 class="text-champagne text-sm mb-3 font-body font-semibold">🧠 AI 生命洞察</h2>
      <p v-if="aiInsight" class="text-sm text-text-warm leading-relaxed">{{ aiInsight }}</p>
      <p v-else class="text-xs text-text-faint">点击按钮，让 AI 为你生成今日洞察</p>
      <button @click="generateInsight" :disabled="insightLoading" class="mt-3 px-4 py-2 bg-kinpaku/15 text-kinpaku text-xs rounded-xl hover:bg-kinpaku/25 transition disabled:opacity-50 border border-hairline-strong">
        {{ insightLoading ? 'AI 思考中...' : '✨ 获取今日洞察' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage, KEYS } from '../services/storage';
import { askAI } from '../services/ai';

const now = new Date();
const hour = now.getHours();
const greeting = hour < 6 ? { text: '夜深了，生活家', sub: '好好休息，明天会更好' } : hour < 12 ? { text: '早安，生活家', sub: '新的一天，元气满满' } : hour < 14 ? { text: '午安，生活家', sub: '中场休息，继续前行' } : hour < 18 ? { text: '下午好，生活家', sub: '时光正好，不负韶华' } : { text: '晚安，生活家', sub: '回顾今日，安然入梦' };
const today = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

const recentDiaries = computed(() => storage.get(KEYS.DIARIES).slice(0, 3));
const pendingTasks = computed(() => storage.get(KEYS.TASKS).filter(t => !t.done).slice(0, 5));

const stats = computed(() => [
  { icon: '📖', label: '日记篇数', value: storage.get(KEYS.DIARIES).length, to: '/diary' },
  { icon: '✅', label: '待办任务', value: storage.get(KEYS.TASKS).filter(t => !t.done).length, to: '/tasks' },
  { icon: '⏳', label: '里程碑', value: storage.get(KEYS.MILESTONES).length, to: '/timeline' },
]);

const priorityColor = (p) => {
  const map = { urgent: 'bg-vermilion', important: 'bg-kinpaku', normal: 'bg-patina', low: 'bg-graphite-2' };
  return map[p] || 'bg-graphite';
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