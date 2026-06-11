<template>
  <div class="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6">
    <div class="border-b border-warmer-200 pb-4">
      <h1 class="text-2xl font-bold text-navy-500 font-heading handwritten">?? ???????</h1>
      <p class="text-sm text-muted mt-1">?????AI ??????</p>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-warmer-200 shadow-card space-y-4">
      <div class="flex items-center gap-1 md:gap-2 flex-wrap">
        <span class="text-sm text-body shrink-0">?????</span>
        <button v-for="m in moods" :key="m" @click="form.mood = m" class="text-xl md:text-2xl px-1.5 py-1 rounded-2xl transition" :class="form.mood === m ? 'bg-warmer-100 scale-110' : 'hover:bg-warmer-100 text-subtle'">{{ m }}</button>
      </div>
      <input v-model="form.title" placeholder="???????????" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 placeholder:text-subtle handwritten" />
      <textarea v-model="form.content" rows="5" placeholder="????????..." class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 resize-none placeholder:text-subtle"></textarea>
      <div class="flex justify-between items-center">
        <button @click="aiComfort" :disabled="aiLoading" class="px-4 py-2 bg-sage-400/10 text-sage-500 text-sm rounded-2xl hover:bg-sage-400/20 transition disabled:opacity-50 font-body">{{ aiLoading ? 'AI ???...' : '?? ? AI ??' }}</button>
        <button @click="saveDiary" class="px-6 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition btn-save font-body">????</button>
      </div>
      <div v-if="aiReply" class="p-4 bg-sage-400/5 rounded-2xl text-sm text-body leading-relaxed whitespace-pre-wrap border border-sage-400/10">{{ aiReply }}</div>
    </div>

    <div class="space-y-3">
      <div v-for="d in diaries" :key="d.id" class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card hover:shadow-soft transition">
        <div class="flex justify-between items-start">
          <div><span class="text-xl mr-2">{{ d.mood }}</span><span v-if="d.title" class="font-bold text-navy-500 font-heading handwritten">{{ d.title }}</span></div>
          <div class="flex items-center gap-2"><span class="text-xs text-muted handwritten">{{ d.createdAt }}</span><button @click="deleteDiary(d.id)" class="text-coral-400 hover:text-coral-500 text-xs btn-delete">??</button></div>
        </div>
        <p class="mt-2 text-sm text-body leading-relaxed whitespace-pre-wrap">{{ d.content }}</p>
        <div v-if="d.aiReply" class="mt-3 p-3 bg-sage-400/5 rounded-2xl text-sm text-body leading-relaxed border border-sage-400/10">?? {{ d.aiReply }}</div>
      </div>
      <div v-if="diaries.length === 0" class="text-center text-muted text-sm py-10">???????????? ??</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const moods = ['??','??','??','??','??','??','??','??'];
const form = ref({ mood:'??',title:'',content:'' }); const aiReply = ref(''); const aiLoading = ref(false);
const diaryVersion = ref(0); const diaries = computed(() => { diaryVersion.value; return storage.get(KEYS.DIARIES); });
const refreshDiaries = () => { diaryVersion.value++; };
const saveDiary = () => { if(!form.value.content.trim()) return alert('???????'); storage.add(KEYS.DIARIES,{...form.value,aiReply:aiReply.value}); form.value={mood:'??',title:'',content:''}; aiReply.value=''; refreshDiaries(); };
const deleteDiary = (id) => { if(confirm('?????')){ storage.delete(KEYS.DIARIES,id); refreshDiaries(); } };
const aiComfort = async () => { if(!form.value.content.trim()) return alert('??????'); aiLoading.value=true; try{ const r=await askAI({systemPrompt:'??????????????????????????????',userMessage:'??'+form.value.mood+'?'+form.value.content}); aiReply.value=r; }catch(e){aiReply.value='?? '+e.message;} aiLoading.value=false; };
</script>