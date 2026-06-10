<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <div class="border-b pb-4">
      <h1 class="text-2xl font-black text-slate-800">🧰 实用工具箱</h1>
      <p class="text-xs text-slate-400 mt-1">灵感、专注力、习惯追踪一站搞定</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 class="font-bold text-slate-700 text-sm">💡 灵感捕手</h2>
        <div class="flex gap-2">
          <input v-model="idea" placeholder="快速记录一个灵感..." class="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-300" @keyup.enter="addIdea" />
          <button @click="addIdea" class="px-4 py-2 bg-amber-500 text-white text-sm rounded-xl hover:bg-amber-600 transition">记录</button>
        </div>
        <div class="space-y-1.5 max-h-48 overflow-y-auto">
          <div v-for="i in ideas" :key="i.id" class="flex justify-between items-center p-2 bg-amber-50 rounded-lg text-xs">
            <span class="text-slate-700">{{ i.content }}</span>
            <button @click="removeIdea(i.id)" class="text-red-400 hover:text-red-600">✕</button>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 flex flex-col items-center">
        <h2 class="font-bold text-slate-700 text-sm self-start">🍅 番茄专注钟</h2>
        <div class="flex items-center gap-2">
          <input v-model.number="customMinutes" type="number" min="1" max="120" class="w-16 p-1 border rounded-lg text-sm text-center" placeholder="分钟" />
          <span class="text-xs text-slate-500">分钟</span>
        </div>
        <div class="text-5xl font-mono font-black text-slate-800 my-4">{{ formatTime() }}</div>
        <div class="flex gap-3">
          <button @click="toggleTimer" class="px-5 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition">
            {{ isRunning ? '暂停' : '开始' }}
          </button>
          <button @click="resetTimer" class="px-5 py-2 bg-slate-200 text-slate-700 text-sm rounded-xl hover:bg-slate-300 transition">重置</button>
          <button @click="showStats = !showStats" class="px-5 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition">统计</button>
        </div>
        <div v-if="showStats" class="mt-4 p-3 bg-blue-50 rounded-xl w-full text-xs space-y-1">
          <div class="flex justify-between"><span>今日专注:</span><span class="font-bold">{{ todayFocusMinutes }}分钟</span></div>
          <div class="flex justify-between"><span>本月专注:</span><span class="font-bold">{{ monthFocusMinutes }}分钟</span></div>
          <div class="flex justify-between"><span>总计专注:</span><span class="font-bold">{{ totalFocusMinutes }}分钟</span></div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 class="font-bold text-slate-700 text-sm">🧮 计算器</h2>
        <div class="bg-slate-100 p-3 rounded-xl text-right font-mono text-2xl h-14 flex items-center justify-end">
          {{ calcDisplay }}
        </div>
        <div class="grid grid-cols-4 gap-2">
          <button v-for="btn in calcButtons" :key="btn" @click="calcInput(btn)" :class="calcBtnClass(btn)" class="p-3 rounded-xl text-sm font-bold">
            {{ btn }}
          </button>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 class="font-bold text-slate-700 text-sm">🎯 未来时光目标</h2>
        <div class="flex gap-2">
          <input v-model="goalForm.title" placeholder="目标名称" class="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-green-300" />
          <input v-model="goalForm.date" type="date" class="p-2.5 border rounded-xl text-sm outline-none" />
        </div>
        <button @click="addGoal" class="px-4 py-2 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 transition w-full">添加目标</button>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div v-for="g in goals" :key="g.id" class="flex justify-between items-center p-2 bg-green-50 rounded-lg text-xs">
            <div>
              <span class="text-slate-700 font-medium">{{ g.title }}</span>
              <div class="text-slate-500">{{ getGoalDays(g.date) }}</div>
            </div>
            <button @click="removeGoal(g.id)" class="text-red-400 hover:text-red-600">✕</button>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 class="font-bold text-slate-700 text-sm">🏷️ AI 万能起名器</h2>
        <div class="flex gap-2">
          <input v-model="namingInput" placeholder="描述你想起名的对象..." class="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300" />
          <button @click="generateNames" :disabled="namingLoading" class="px-4 py-2 bg-indigo-500 text-white text-sm rounded-xl hover:bg-indigo-600 transition disabled:opacity-50">
            {{ namingLoading ? '...' : '生成' }}
          </button>
        </div>
        <div v-if="namingResult" class="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">{{ namingResult }}</div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 class="font-bold text-slate-700 text-sm">📊 今日习惯打卡</h2>
        <div class="flex gap-2">
          <input v-model="habitInput" placeholder="添加一个习惯..." class="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-300" @keyup.enter="addHabit" />
          <button @click="addHabit" class="px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition">添加</button>
        </div>
        <div class="space-y-1.5">
          <div v-for="h in habits" :key="h.id" class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-xs">
            <input type="checkbox" :checked="h.done" @change="toggleHabit(h)" class="accent-blue-500" />
            <span :class="{ 'line-through text-slate-400': h.done }" class="text-slate-700">{{ h.title }}</span>
            <button @click="removeHabit(h.id)" class="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage } from '../services/storage';
import { askAI } from '../services/ai';

const IDEA_KEY = 'lb_ideas';
const HABIT_KEY = 'lb_habits';
const GOAL_KEY = 'lb_goals';
const STATS_KEY = 'lb_focus_stats';

const idea = ref('');
const ideas = ref(storage.get(IDEA_KEY));
const addIdea = () => {
  if (!idea.value.trim()) return;
  storage.add(IDEA_KEY, { content: idea.value });
  ideas.value = storage.get(IDEA_KEY);
  idea.value = '';
};
const removeIdea = (id) => { storage.delete(IDEA_KEY, id); ideas.value = storage.get(IDEA_KEY); };

const customMinutes = ref(25);
const timeLeft = ref(25 * 60);
const isRunning = ref(false);
const showStats = ref(false);
let timerInterval = null;

const formatTime = () => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
  const s = (timeLeft.value % 60).toString().padStart(2, '0');
  return m + ':' + s;
};

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval);
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(timerInterval);
        isRunning.value = false;
        const completedMinutes = customMinutes.value;
        saveFocusStats(completedMinutes);
        alert('🌟 恭喜你完成一轮深度专注！');
      }
    }, 1000);
  }
  isRunning.value = !isRunning.value;
};

const resetTimer = () => {
  clearInterval(timerInterval);
  isRunning.value = false;
  timeLeft.value = customMinutes.value * 60;
};

const saveFocusStats = (minutes) => {
  const stats = storage.get(STATS_KEY);
  const today = new Date().toDateString();
  const todayEntry = stats.find(s => s.date === today);
  if (todayEntry) {
    todayEntry.minutes += minutes;
  } else {
    stats.push({ date: today, minutes });
  }
  storage.save(STATS_KEY, stats);
};

const todayFocusMinutes = computed(() => {
  const stats = storage.get(STATS_KEY);
  const today = new Date().toDateString();
  const entry = stats.find(s => s.date === today);
  return entry ? entry.minutes : 0;
});

const monthFocusMinutes = computed(() => {
  const stats = storage.get(STATS_KEY);
  const now = new Date();
  return stats
    .filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, s) => sum + s.minutes, 0);
});

const totalFocusMinutes = computed(() => {
  return storage.get(STATS_KEY).reduce((sum, s) => sum + s.minutes, 0);
});

const calcDisplay = ref('0');
const calcButtons = ['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];

const calcBtnClass = (btn) => {
  if (['+', '-', '*', '/'].includes(btn)) return 'bg-orange-500 hover:bg-orange-600 text-white';
  if (btn === '=') return 'bg-blue-500 hover:bg-blue-600 text-white';
  if (btn === 'C') return 'bg-red-500 hover:bg-red-600 text-white';
  return 'bg-slate-200 hover:bg-slate-300 text-slate-800';
};

const calcInput = (btn) => {
  if (btn === 'C') {
    calcDisplay.value = '0';
  } else if (btn === '=') {
    try {
      calcDisplay.value = eval(calcDisplay.value).toString();
    } catch {
      calcDisplay.value = 'Error';
    }
  } else {
    if (calcDisplay.value === '0' && btn !== '.') {
      calcDisplay.value = btn;
    } else {
      calcDisplay.value += btn;
    }
  }
};

const goalForm = ref({ title: '', date: '' });
const goals = ref(storage.get(GOAL_KEY));

const addGoal = () => {
  if (!goalForm.value.title.trim() || !goalForm.value.date) return alert('请填写目标名称和日期');
  storage.add(GOAL_KEY, { ...goalForm.value });
  goals.value = storage.get(GOAL_KEY);
  goalForm.value = { title: '', date: '' };
};

const removeGoal = (id) => {
  storage.delete(GOAL_KEY, id);
  goals.value = storage.get(GOAL_KEY);
};

const getGoalDays = (dateStr) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
  
  if (diff > 0) {
    return `还有 ${diff} 天`;
  } else if (diff < 0) {
    return `已过去 ${Math.abs(diff)} 天`;
  } else {
    return '就是今天！🎉';
  }
};

const namingInput = ref('');
const namingResult = ref('');
const namingLoading = ref(false);

const generateNames = async () => {
  if (!namingInput.value.trim()) return alert('请描述起名对象');
  namingLoading.value = true;
  try {
    const res = await askAI({
      systemPrompt: '你是一个创意起名大师，请为用户生成5个富有创意的名字，每个名字附带简短解释，格式清晰。',
      userMessage: '请为以下对象起名：' + namingInput.value
    });
    namingResult.value = res;
  } catch (e) {
    namingResult.value = '⚠️ ' + e.message;
  }
  namingLoading.value = false;
};

const habitInput = ref('');
const habits = ref(storage.get(HABIT_KEY));

const addHabit = () => {
  if (!habitInput.value.trim()) return;
  storage.add(HABIT_KEY, { title: habitInput.value, done: false });
  habits.value = storage.get(HABIT_KEY);
  habitInput.value = '';
};

const toggleHabit = (h) => {
  storage.update(HABIT_KEY, h.id, { done: !h.done });
  habits.value = storage.get(HABIT_KEY);
};

const removeHabit = (id) => {
  storage.delete(HABIT_KEY, id);
  habits.value = storage.get(HABIT_KEY);
};
</script>
