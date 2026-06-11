<template>
  <div class="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
    <!-- Greeting -->
    <div class="bg-navy-500 text-white p-6 md:p-10 rounded-3xl shadow-lift">
      <h1 class="text-2xl md:text-3xl font-bold font-heading">{{ greeting.text }}</h1>
      <p class="mt-2 text-white/60 text-sm md:text-base">{{ greeting.sub }}</p>
      <p class="mt-1 text-white/40 text-xs handwritten">{{ today }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="card in stats" :key="card.label" class="bg-white p-6 rounded-3xl border border-warmer-200 shadow-card hover:shadow-soft transition cursor-pointer hover:scale-105" @click="$router.push(card.to)">
        <div class="text-3xl">{{ card.icon }}</div>
        <div class="mt-3 text-3xl font-bold text-navy-500 font-heading">{{ card.value }}</div>
        <div class="text-sm text-muted mt-1">{{ card.label }}</div>
      </div>
    </div>

    <!-- Panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-3xl border border-warmer-200 shadow-card">
        <h2 class="font-bold text-navy-500 text-base font-heading mb-3">?? ????</h2>
        <div v-if="recentDiaries.length === 0" class="text-sm text-muted py-6 text-center">???????????????</div>
        <div v-else class="space-y-2">
          <div v-for="d in recentDiaries" :key="d.id" class="p-3 bg-warmer-100 rounded-2xl text-sm">
            <div class="flex justify-between"><span class="font-semibold text-navy-500">{{ d.mood }}</span><span class="text-muted handwritten text-xs">{{ d.createdAt }}</span></div>
            <p class="text-body mt-1 line-clamp-2">{{ d.content }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-warmer-200 shadow-card">
        <h2 class="font-bold text-navy-500 text-base font-heading mb-3">?? ????</h2>
        <div v-if="pendingTasks.length === 0" class="text-sm text-muted py-6 text-center">??????</div>
        <div v-else class="space-y-2">
          <div v-for="t in pendingTasks" :key="t.id" class="p-3 bg-warmer-100 rounded-2xl text-sm flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="t.quadrant === 'q1' ? 'bg-coral-400' : t.quadrant === 'q2' ? 'bg-sage-400' : t.quadrant === 'q3' ? 'bg-amber-400' : 'bg-subtle'"></span>
            <span class="text-body">{{ t.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insight -->
    <div class="bg-white p-6 rounded-3xl border border-warmer-200 shadow-card">
      <h2 class="font-bold text-navy-500 text-base font-heading mb-3">?? AI ????</h2>
      <p v-if="aiInsight" class="text-body leading-relaxed">{{ aiInsight }}</p>
      <p v-else class="text-muted text-sm">?????? AI ????????</p>
      <button @click="generateInsight" :disabled="insightLoading" class="mt-4 px-5 py-2.5 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition disabled:opacity-50 font-body">
        {{ insightLoading ? 'AI ???...' : '? ??????' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const now = new Date(); const hour = now.getHours();
const greeting = hour < 6 ? { text:'??????? ??',sub:'??????????' } : hour < 12 ? { text:'?????? ??',sub:'?????????' } : hour < 14 ? { text:'?????? ??',sub:'?????????' } : hour < 18 ? { text:'??????? ???',sub:'?????????' } : { text:'?????? ??',sub:'?????????' };
const today = now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
const recentDiaries = computed(() => storage.get(KEYS.DIARIES).slice(0,3));
const pendingTasks = computed(() => storage.get(KEYS.TASKS).filter(t=>!t.done).slice(0,5));
const stats = computed(() => [{icon:'??',label:'????',value:storage.get(KEYS.DIARIES).length,to:'/diary'},{icon:'??',label:'????',value:storage.get(KEYS.TASKS).filter(t=>!t.done).length,to:'/tasks'},{icon:'???',label:'???',value:storage.get(KEYS.MILESTONES).length,to:'/timeline'}]);
const aiInsight = ref(''); const insightLoading = ref(false);
const generateInsight = async () => { insightLoading.value=true; try{ const d=storage.get(KEYS.DIARIES).slice(0,5).map(d=>d.content).join('?'); const t=storage.get(KEYS.TASKS).filter(t=>!t.done).map(t=>t.title).join('?'); const r=await askAI({systemPrompt:'???????????????????????????????????',userMessage:'?????'+(d||'??')+'????'+(t||'??')+'???????????'}); aiInsight.value=r; }catch(e){aiInsight.value='?? '+e.message;} insightLoading.value=false; };
</script>