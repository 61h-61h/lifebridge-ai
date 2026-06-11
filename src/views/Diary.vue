<template>
  <div class="max-w-2xl mx-auto space-y-10">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-800 font-heading">情绪日记</h1>
      <p class="text-sm text-slate-400 mt-2">记录心情，AI 倾听你的心声</p>
    </div>

    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div>
        <div class="text-sm text-slate-500 mb-3">此刻心情</div>
        <div class="flex gap-2 flex-wrap">
          <button v-for="m in moods" :key="m" @click="form.mood = m"
            class="text-2xl p-2.5 rounded-2xl transition min-w-[48px] min-h-[48px] flex items-center justify-center"
            :class="form.mood === m ? 'bg-slate-100 scale-110 ring-1 ring-slate-200' : 'hover:bg-slate-50 text-slate-400'">{{ m }}</button>
        </div>
      </div>
      <input v-model="form.title" placeholder="给今天起个标题（可选）"
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300 handwritten" />
      <textarea v-model="form.content" rows="6" placeholder="写下你此刻的感受..."
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 resize-none placeholder:text-slate-300"></textarea>
      <div class="flex justify-between items-center pt-2">
        <button @click="aiComfort" :disabled="aiLoading"
          class="px-5 py-3 bg-slate-50 text-slate-600 text-sm rounded-2xl hover:bg-slate-100 transition disabled:opacity-50 font-body">
          {{ aiLoading ? 'AI 倾听中...' : '让 AI 回应' }}
        </button>
        <button @click="saveDiary"
          class="px-8 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition btn-save font-body">
          保存日记
        </button>
      </div>
      <div v-if="aiReply" class="p-5 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed whitespace-pre-wrap border border-slate-100">
        {{ aiReply }}
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="d in diaries" :key="d.id"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex justify-between items-start gap-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ d.mood }}</span>
            <span v-if="d.title" class="font-bold text-slate-800 font-heading handwritten text-lg">{{ d.title }}</span>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-xs text-slate-400 handwritten">{{ d.createdAt }}</span>
            <button @click="deleteDiary(d.id)"
              class="text-slate-300 hover:text-rose-400 text-sm btn-delete min-w-[44px] min-h-[44px] flex items-center justify-center transition">删除</button>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{{ d.content }}</p>
        <div v-if="d.aiReply" class="mt-4 p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100">
          {{ d.aiReply }}
        </div>
      </div>
      <div v-if="diaries.length === 0" class="text-center text-slate-400 text-sm py-16">还没有日记，写下第一篇吧</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai'; import { Sparkles, Trash2 } from 'lucide-vue-next';
const moods = ['😉','😊','😓','😩','😨','😹','😾','😀'];
const form = ref({ mood:'😉',title:'',content:'' }); const aiReply = ref(''); const aiLoading = ref(false);
const diaryVersion = ref(0); const diaries = computed(() => { diaryVersion.value; return storage.get(KEYS.DIARIES); });
const refreshDiaries = () => { diaryVersion.value++; };
const saveDiary = () => { if(!form.value.content.trim()) return alert('请写下你的感受'); storage.add(KEYS.DIARIES,{...form.value,aiReply:aiReply.value}); form.value={mood:'😉',title:'',content:''}; aiReply.value=''; refreshDiaries(); };
const deleteDiary = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.DIARIES,id); refreshDiaries(); } };
const aiComfort = async () => { if(!form.value.content.trim()) return alert('请先写下感受'); aiLoading.value=true; try{ const r=await askAI({systemPrompt:'你是一个温暖的心理倾听者，用简短的话安慰鼓励对方，语气亲切。',userMessage:'心情'+form.value.mood+'：'+form.value.content}); aiReply.value=r; }catch(e){aiReply.value='⚠️ '+e.message;} aiLoading.value=false; };
</script>
<style scoped>
.diary-root { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
@media (min-width: 768px) { .diary-root { padding: 2.5rem 2rem; } }
</style>
