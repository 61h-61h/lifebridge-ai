<template>
  <div class="space-y-6">
    <div class="border-b border-slate-100 pb-4 flex justify-between items-center">
      <div><h1 class="text-2xl font-bold text-slate-800 font-heading">✅ 四象限任务板</h1><p class="text-sm text-slate-400 mt-1">按照重要与紧急程度管理任务</p></div>
      <button @click="showForm = !showForm" class="px-5 py-2.5 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 hover:scale-[1.02] transition font-body min-h-[44px]" :class="showForm ? 'btn-cancel' : 'btn-add'">{{ showForm ? '取消' : '+ 新增任务' }}</button>
    </div>
    <div v-if="showForm" class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <input v-model="form.title" placeholder="任务名称" class="w-full p-3 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300" />
      <select v-model="form.quadrant" class="w-full p-3 bg-slate-50 rounded-2xl text-sm outline-none text-slate-700">
        <option value="q1">🔶 重要且紧急</option><option value="q2">🟛 重要不紧急</option><option value="q3">🟝 紧急不重要</option><option value="q4">📋 不重要不紧急</option>
      </select>
      <div class="flex items-center gap-3 flex-wrap">
        <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer min-h-[44px]"><input type="checkbox" v-model="form.useAI" class="rounded accent-slate-800" /><span>💻 AI 智能优化</span></label>
        <button @click="addTask" :disabled="taskLoading" class="px-6 py-2.5 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 hover:scale-[1.02] transition disabled:opacity-50 btn-save font-body">{{ taskLoading ? 'AI 优化中...' : '确认添加' }}</button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="q in quadrants" :key="q.key" class="p-5 rounded-3xl border-2 min-h-[180px]" :class="q.bg + ' ' + q.border">
        <h2 class="font-bold text-sm mb-3 font-heading" :class="q.text">{{ q.label }}</h2>
        <div class="space-y-2">
          <div v-for="t in getTasks(q.key)" :key="t.id" class="p-3 bg-white rounded-2xl shadow-sm flex items-start gap-2 border border-slate-100" :class="{'opacity-50 line-through':t.done}">
            <input type="checkbox" :checked="t.done" @change="toggleTask(t)" class="mt-0.5 shrink-0 accent-slate-800" />
            <div class="flex-1 min-w-0"><span class="text-slate-700 font-medium text-sm">{{ t.title }}</span><div v-if="t.aiOptimized" class="text-accent-600 mt-1 text-xs">✨ {{ t.aiOptimized }}</div><div v-if="t.optimizing" class="text-slate-400 mt-1 animate-pulse text-xs">AI 优化中...</div></div>
            <div class="flex gap-1.5 shrink-0"><button @click="optimizeTask(t)" :disabled="t.optimizing" class="text-slate-400 hover:text-slate-600 text-xs min-w-[32px] min-h-[32px]">{{ t.optimizing ? '...' : 'AI' }}</button><button @click="deleteTask(t.id)" class="text-rose-400 hover:text-rose-600 text-xs btn-delete min-w-[32px] min-h-[32px]">✕</button></div>
          </div>
          <div v-if="getTasks(q.key).length === 0" class="text-center text-slate-300 text-sm py-6">暂无任务</div>
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
  { key:'q1',label:'🔶 重要且紧急',border:'border-rose-200',bg:'bg-rose-50/50',text:'text-rose-600' },
  { key:'q2',label:'🟛 重要不紧急',border:'border-amber-200',bg:'bg-amber-50/50',text:'text-amber-600' },
  { key:'q3',label:'🟝 紧急不重要',border:'border-slate-200',bg:'bg-slate-50',text:'text-slate-600' },
  { key:'q4',label:'📋 不重要不紧急',border:'border-slate-200',bg:'bg-slate-50',text:'text-slate-500' },
];
const refreshTasks = () => { taskVersion.value++; };
const getTasks = (q) => tasks.value.filter(t => t.quadrant === q);
const addTask = async () => { if(!form.value.title.trim()) return alert('请输入任务名称'); const d={...form.value,done:false}; const ai=form.value.useAI; form.value={title:'',quadrant:'q2',useAI:false}; if(ai&&d.title.trim()){ showForm.value=false; taskLoading.value=true; const tid=Date.now(); storage.add(KEYS.TASKS,{...d,optimizing:true,aiOptimized:'',id:tid}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是任务管理专家，优化用户的任务描述让它更具体更可执行。',userMessage:'任务：'+d.title}); storage.update(KEYS.TASKS,tid,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,tid,{aiOptimized:'⚠️ '+e.message,optimizing:false});} refreshTasks(); taskLoading.value=false; }else{ storage.add(KEYS.TASKS,{...d,done:false}); showForm.value=false; refreshTasks(); } };
const toggleTask = (t) => { storage.update(KEYS.TASKS,t.id,{done:!t.done}); refreshTasks(); };
const deleteTask = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.TASKS,id); refreshTasks(); } };
const optimizeTask = async (t) => { storage.update(KEYS.TASKS,t.id,{optimizing:true}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是任务管理专家，优化用户的任务描述。',userMessage:'任务：'+t.title}); storage.update(KEYS.TASKS,t.id,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,t.id,{aiOptimized:'⚠️ '+e.message,optimizing:false});} refreshTasks(); };
</script>