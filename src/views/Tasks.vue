<template>
  <div class="p-4 md:p-8 space-y-4 md:space-y-6">
    <div class="border-b border-hairline pb-4 flex justify-between items-center">
      <div><h1 class="text-xl md:text-2xl text-champagne font-display font-semibold">✅ 四象限任务板</h1><p class="text-xs text-text-faint mt-1 font-mono">按照重要与紧急程度管理任务</p></div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition border border-hairline-strong" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '取消' : '+ 新增任务' }}</button>
    </div>
    <div v-if="showForm" class="card p-5 space-y-3">
      <input v-model="form.title" placeholder="任务名称" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong placeholder:text-text-faint" />
      <select v-model="form.quadrant" class="w-full p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none">
        <option value="q1">🔴 重要且紧急</option><option value="q2">🟡 重要不紧急</option><option value="q3">🟢 紧急不重要</option><option value="q4">🔵 不重要不紧急</option>
      </select>
      <div class="flex items-center gap-3 flex-wrap">
        <label class="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer"><input type="checkbox" v-model="form.useAI" class="rounded" /><span>🤖 AI 智能优化</span></label>
        <button @click="addTask" :disabled="taskLoading" class="px-6 py-2 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition disabled:opacity-50 btn-save border border-hairline-strong">{{ taskLoading ? 'AI 优化中...' : '确认添加' }}</button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="q in quadrants" :key="q.key" class="p-3 md:p-4 rounded-2xl border min-h-[150px] md:min-h-[200px]" :class="q.borderClass + ' ' + q.bgClass">
        <h2 class="text-sm mb-3 font-semibold" :class="q.textClass">{{ q.label }}</h2>
        <div class="space-y-2">
          <div v-for="t in getTasks(q.key)" :key="t.id" class="p-2.5 md:p-3 bg-lacquer raised rounded-xl text-xs shadow-sm flex items-start gap-2 border border-hairline" :class="{ 'opacity-50 line-through': t.done }">
            <input type="checkbox" :checked="t.done" @change="toggleTask(t)" class="mt-0.5" />
            <div class="flex-1"><span class="text-text-warm font-medium">{{ t.title }}</span><div v-if="t.aiOptimized" class="text-kinpaku mt-1">✨ {{ t.aiOptimized }}</div><div v-if="t.optimizing" class="text-kinpaku/60 mt-1 animate-pulse text-[10px]">AI 优化中...</div></div>
            <div class="flex flex-col gap-1"><button @click="optimizeTask(t)" :disabled="t.optimizing" class="text-kinpaku/60 hover:text-kinpaku text-[10px]">{{ t.optimizing ? '...' : 'AI' }}</button><button @click="deleteTask(t.id)" class="text-vermilion/60 hover:text-vermilion text-[10px] btn-delete">✕</button></div>
          </div>
          <div v-if="getTasks(q.key).length === 0" class="text-center text-text-faint text-xs py-4">暂无任务</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai';
const showForm = ref(false); const form = ref({ title:'',quadrant:'q2',useAI:false }); const taskVersion = ref(0); const taskLoading = ref(false);
const tasks = computed(() => { taskVersion.value; return storage.get(KEYS.TASKS); });
const quadrants = [
  { key:'q1',label:'🔴 重要且紧急',borderClass:'border-vermilion/30',bgClass:'bg-vermilion/5',textClass:'text-vermilion' },
  { key:'q2',label:'🟡 重要不紧急',borderClass:'border-kinpaku/30',bgClass:'bg-kinpaku/5',textClass:'text-kinpaku' },
  { key:'q3',label:'🟢 紧急不重要',borderClass:'border-patina/30',bgClass:'bg-patina/5',textClass:'text-patina' },
  { key:'q4',label:'🔵 不重要不紧急',borderClass:'border-graphite-2',bgClass:'bg-graphite/20',textClass:'text-text-muted' },
];
const refreshTasks = () => { taskVersion.value++; };
const getTasks = (q) => tasks.value.filter(t => t.quadrant === q);
const addTask = async () => { if(!form.value.title.trim()) return alert('请输入任务名称'); const d={...form.value,done:false}; const ai=form.value.useAI; form.value={title:'',quadrant:'q2',useAI:false}; if(ai&&d.title.trim()){ showForm.value=false; taskLoading.value=true; const tid=Date.now(); storage.add(KEYS.TASKS,{...d,optimizing:true,aiOptimized:'',id:tid}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是一个任务管理专家，请优化用户的任务描述，让它更具体、更可执行。',userMessage:'任务：'+d.title}); storage.update(KEYS.TASKS,tid,{aiOptimized:r,optimizing:false}); }catch(e){ storage.update(KEYS.TASKS,tid,{aiOptimized:'⚠️ '+e.message,optimizing:false}); } refreshTasks(); taskLoading.value=false; }else{ storage.add(KEYS.TASKS,{...d,done:false}); showForm.value=false; refreshTasks(); } };
const toggleTask = (t) => { storage.update(KEYS.TASKS,t.id,{done:!t.done}); refreshTasks(); };
const deleteTask = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.TASKS,id); refreshTasks(); } };
const optimizeTask = async (t) => { storage.update(KEYS.TASKS,t.id,{optimizing:true}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是一个任务管理专家，请优化用户的任务描述，让它更具体、更可执行。',userMessage:'任务：'+t.title}); storage.update(KEYS.TASKS,t.id,{aiOptimized:r,optimizing:false}); }catch(e){ storage.update(KEYS.TASKS,t.id,{aiOptimized:'⚠️ '+e.message,optimizing:false}); } refreshTasks(); };
</script>