<template>
  <div class="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
    <div class="border-b border-warmer-200 pb-4 flex justify-between items-center">
      <div><h1 class="text-2xl font-bold text-navy-500 font-heading">?? ??????</h1><p class="text-sm text-muted mt-1">?????????????</p></div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition font-body" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '??' : '+ ????' }}</button>
    </div>

    <div v-if="showForm" class="bg-white p-5 rounded-3xl border border-warmer-200 shadow-card space-y-3">
      <input v-model="form.title" placeholder="????" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm text-body outline-none focus:ring-2 focus:ring-sage-400/30 placeholder:text-subtle" />
      <select v-model="form.quadrant" class="w-full p-3 bg-warmer-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-sage-400/30 text-body">
        <option value="q1">?? ?????</option><option value="q2">?? ?????</option><option value="q3">? ?????</option><option value="q4">?? ??????</option>
      </select>
      <div class="flex items-center gap-3 flex-wrap">
        <label class="flex items-center gap-1.5 text-sm text-body cursor-pointer"><input type="checkbox" v-model="form.useAI" class="rounded accent-sage-400" /><span>?? AI ????</span></label>
        <button @click="addTask" :disabled="taskLoading" class="px-6 py-2 bg-navy-500 text-white text-sm rounded-2xl hover:bg-navy-600 hover:scale-105 transition disabled:opacity-50 btn-save font-body">{{ taskLoading ? 'AI ???...' : '????' }}</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="q in quadrants" :key="q.key" class="p-5 rounded-3xl border-2 min-h-[180px]" :class="q.bg + ' ' + q.border">
        <h2 class="font-bold text-sm mb-3 font-heading" :class="q.text">{{ q.label }}</h2>
        <div class="space-y-2">
          <div v-for="t in getTasks(q.key)" :key="t.id" class="p-3 bg-white rounded-2xl shadow-sm flex items-start gap-2 border border-warmer-200" :class="{'opacity-50 line-through':t.done}">
            <input type="checkbox" :checked="t.done" @change="toggleTask(t)" class="mt-0.5 shrink-0 accent-sage-400" />
            <div class="flex-1 min-w-0"><span class="text-body font-medium text-sm">{{ t.title }}</span><div v-if="t.aiOptimized" class="text-sage-500 mt-1 text-xs">? {{ t.aiOptimized }}</div><div v-if="t.optimizing" class="text-sage-400 mt-1 animate-pulse text-xs">AI ???...</div></div>
            <div class="flex flex-col gap-1 shrink-0"><button @click="optimizeTask(t)" :disabled="t.optimizing" class="text-sage-400 hover:text-sage-500 text-xs">{{ t.optimizing ? '...' : 'AI' }}</button><button @click="deleteTask(t.id)" class="text-coral-400 hover:text-coral-500 text-xs btn-delete">?</button></div>
          </div>
          <div v-if="getTasks(q.key).length === 0" class="text-center text-subtle text-sm py-6">????</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const showForm = ref(false); const form = ref({title:'',quadrant:'q2',useAI:false}); const taskVersion = ref(0); const taskLoading = ref(false);
const tasks = computed(() => { taskVersion.value; return storage.get(KEYS.TASKS); });
const quadrants = [
  { key:'q1',label:'?? ?????',border:'border-coral-200',bg:'bg-coral-400/5',text:'text-coral-400' },
  { key:'q2',label:'?? ?????',border:'border-sage-200',bg:'bg-sage-400/5',text:'text-sage-400' },
  { key:'q3',label:'? ?????',border:'border-amber-200',bg:'bg-amber-50',text:'text-amber-600' },
  { key:'q4',label:'?? ??????',border:'border-warmer-300',bg:'bg-warmer-100',text:'text-muted' },
];
const refreshTasks = () => { taskVersion.value++; };
const getTasks = (q) => tasks.value.filter(t => t.quadrant === q);
const addTask = async () => { if(!form.value.title.trim()) return alert('???????'); const d={...form.value,done:false}; const ai=form.value.useAI; form.value={title:'',quadrant:'q2',useAI:false}; if(ai&&d.title.trim()){ showForm.value=false; taskLoading.value=true; const tid=Date.now(); storage.add(KEYS.TASKS,{...d,optimizing:true,aiOptimized:'',id:tid}); refreshTasks(); try{ const r=await askAI({systemPrompt:'????????????????????????????',userMessage:'???'+d.title}); storage.update(KEYS.TASKS,tid,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,tid,{aiOptimized:'?? '+e.message,optimizing:false});} refreshTasks(); taskLoading.value=false; }else{ storage.add(KEYS.TASKS,{...d,done:false}); showForm.value=false; refreshTasks(); } };
const toggleTask = (t) => { storage.update(KEYS.TASKS,t.id,{done:!t.done}); refreshTasks(); };
const deleteTask = (id) => { if(confirm('?????')){ storage.delete(KEYS.TASKS,id); refreshTasks(); } };
const optimizeTask = async (t) => { storage.update(KEYS.TASKS,t.id,{optimizing:true}); refreshTasks(); try{ const r=await askAI({systemPrompt:'???????????????????',userMessage:'???'+t.title}); storage.update(KEYS.TASKS,t.id,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,t.id,{aiOptimized:'?? '+e.message,optimizing:false});} refreshTasks(); };
</script>