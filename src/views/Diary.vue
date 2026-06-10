<template>
  <div class="p-8 max-w-3xl mx-auto space-y-6">
    <div class="border-b pb-4">
      <h1 class="text-2xl font-black text-slate-800 handwritten">📖 情绪日记与树洞</h1>
      <p class="text-xs text-slate-400 mt-1">记录心情，AI 倾听你的心声</p>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-slate-600">此刻心情：</span>
        <button v-for="m in moods" :key="m" @click="form.mood = m"
          class="text-xl px-2 py-1 rounded-lg transition"
          :class="form.mood === m ? 'bg-indigo-100 scale-110' : 'hover:bg-slate-50'">
          {{ m }}
        </button>
      </div>
      <input v-model="form.title" placeholder="给今天起个标题（可选）" class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300" />
      <textarea v-model="form.content" rows="5" placeholder="写下你此刻的感受..." class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300 resize-none"></textarea>
      <div class="flex justify-between items-center">
        <button @click="aiComfort" :disabled="aiLoading" class="px-4 py-2 bg-purple-100 text-purple-700 text-xs rounded-xl hover:bg-purple-200 transition disabled:opacity-50">
          {{ aiLoading ? 'AI 倾听中...' : '🤖 让 AI 回应' }}
        </button>
        <button @click="saveDiary" class="px-6 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition btn-save">保存日记</button>
      </div>
      <div v-if="aiReply" class="p-4 bg-purple-50 rounded-xl text-sm text-purple-800 leading-relaxed whitespace-pre-wrap">{{ aiReply }}</div>
    </div>

    <div class="space-y-3">
      <div v-for="d in diaries" :key="d.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-xl mr-2">{{ d.mood }}</span>
            <span v-if="d.title" class="font-bold text-slate-700 text-sm">{{ d.title }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400">{{ d.createdAt }}</span>
            <button @click="deleteDiary(d.id)" class="text-red-400 hover:text-red-600 text-xs btn-delete">删除</button>
          </div>
        </div>
        <p class="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{{ d.content }}</p>
        <div v-if="d.aiReply" class="mt-3 p-3 bg-purple-50 rounded-xl text-xs text-purple-700 leading-relaxed">🤖 {{ d.aiReply }}</div>
      </div>
      <div v-if="diaries.length === 0" class="text-center text-slate-400 text-sm py-8">还没有日记，写下第一篇吧 ✍️</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage, KEYS } from '../services/storage';
import { askAI } from '../services/ai';

const moods = ['😊', '😌', '😐', '😢', '😡', '🤔', '😴', '🥰'];
const form = ref({ mood: '😊', title: '', content: '' });
const aiReply = ref('');
const aiLoading = ref(false);
const diaryVersion = ref(0);
const diaries = computed(() => {
  diaryVersion.value;
  return storage.get(KEYS.DIARIES);
});

const refreshDiaries = () => {
  diaryVersion.value++;
};

const saveDiary = () => {
  if (!form.value.content.trim()) return alert('请写下你的感受');
  storage.add(KEYS.DIARIES, { ...form.value, aiReply: aiReply.value });
  form.value = { mood: '😊', title: '', content: '' };
  aiReply.value = '';
  refreshDiaries();
};

const deleteDiary = (id) => {
  if (confirm('确定删除这篇日记？')) {
    storage.delete(KEYS.DIARIES, id);
    refreshDiaries();
  }
};

const aiComfort = async () => {
  if (!form.value.content.trim()) return alert('请先写下你的感受');
  aiLoading.value = true;
  try {
    const res = await askAI({
      systemPrompt: '你是一个温暖的心理倾听者，用简短的话安慰和鼓励对方，语气亲切，不要说教。',
      userMessage: `我今天心情${form.value.mood}，${form.value.content}`
    });
    aiReply.value = res;
  } catch (e) {
    aiReply.value = '⚠️ ' + e.message;
  }
  aiLoading.value = false;
};
</script>
