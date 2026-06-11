<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-4 md:space-y-6">
    <div class="border-b border-hairline pb-4">
      <h1 class="text-xl md:text-2xl text-champagne font-display font-semibold">📖 情绪日记与树洞</h1>
      <p class="text-xs text-text-faint mt-1 font-mono">记录心情，AI 倾听你的心声</p>
    </div>
    <div class="card p-4 md:p-6 space-y-3 md:space-y-4">
      <div class="flex items-center gap-1 md:gap-2 flex-wrap">
        <span class="text-sm text-text-muted shrink-0">此刻心情：</span>
        <button v-for="m in moods" :key="m" @click="form.mood = m"
          class="text-lg md:text-xl px-1 md:px-2 py-1 rounded-lg transition shrink-0"
          :class="form.mood === m ? 'bg-kinpaku/20 scale-110' : 'hover:bg-white/5 text-text-muted'">{{ m }}</button>
      </div>
      <input v-model="form.title" placeholder="给今天起个标题（可选）" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong placeholder:text-text-faint" />
      <textarea v-model="form.content" rows="5" placeholder="写下你此刻的感受..." class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong resize-none placeholder:text-text-faint"></textarea>
      <div class="flex justify-between items-center">
        <button @click="aiComfort" :disabled="aiLoading" class="px-4 py-2 bg-patina/15 text-patina text-xs rounded-xl hover:bg-patina/25 transition disabled:opacity-50 border border-patina/30">
          {{ aiLoading ? 'AI 倾听中...' : '🤖 让 AI 回应' }}
        </button>
        <button @click="saveDiary" class="px-6 py-2 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition btn-save border border-hairline-strong">保存日记</button>
      </div>
      <div v-if="aiReply" class="p-4 bg-patina/10 rounded-xl text-sm text-patina-pale leading-relaxed whitespace-pre-wrap border border-patina/20">{{ aiReply }}</div>
    </div>
    <div class="space-y-3">
      <div v-for="d in diaries" :key="d.id" class="card p-5 hover:border-hairline-strong transition">
        <div class="flex justify-between items-start">
          <div><span class="text-xl mr-2">{{ d.mood }}</span><span v-if="d.title" class="text-champagne text-sm font-semibold">{{ d.title }}</span></div>
          <div class="flex items-center gap-2"><span class="text-[10px] text-text-faint font-mono">{{ d.createdAt }}</span><button @click="deleteDiary(d.id)" class="text-vermilion/70 hover:text-vermilion text-xs btn-delete">删除</button></div>
        </div>
        <p class="mt-2 text-sm text-text-warm leading-relaxed whitespace-pre-wrap">{{ d.content }}</p>
        <div v-if="d.aiReply" class="mt-3 p-3 bg-patina/10 rounded-xl text-xs text-patina-pale leading-relaxed border border-patina/20">🤖 {{ d.aiReply }}</div>
      </div>
      <div v-if="diaries.length === 0" class="text-center text-text-faint text-sm py-8">还没有日记，写下第一篇吧 ✍️</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const moods = ['😊','😌','😐','😢','😡','🤔','😴','🥰'];
const form = ref({ mood:'😊',title:'',content:'' }); const aiReply = ref(''); const aiLoading = ref(false);
const diaryVersion = ref(0); const diaries = computed(() => { diaryVersion.value; return storage.get(KEYS.DIARIES); });
const refreshDiaries = () => { diaryVersion.value++; };
const saveDiary = () => { if(!form.value.content.trim()) return alert('请写下你的感受'); storage.add(KEYS.DIARIES,{...form.value,aiReply:aiReply.value}); form.value={mood:'😊',title:'',content:''}; aiReply.value=''; refreshDiaries(); };
const deleteDiary = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.DIARIES,id); refreshDiaries(); } };
const aiComfort = async () => { if(!form.value.content.trim()) return alert('请先写下感受'); aiLoading.value=true; try{ const res=await askAI({systemPrompt:'你是一个温暖的心理倾听者，用简短的话安慰和鼓励对方，语气亲切，不要说教。',userMessage:'我今天心情'+form.value.mood+'，'+form.value.content}); aiReply.value=res; }catch(e){ aiReply.value='⚠️ '+e.message; } aiLoading.value=false; };
</script>