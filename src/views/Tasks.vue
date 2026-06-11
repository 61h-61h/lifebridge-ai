<template>
  <div class="tasks-root space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-800 font-heading">四象限任务板</h1>
      <p class="text-sm text-slate-400 mt-2">按照重要与紧急程度管理任务</p>
    </div>

    <div class="flex justify-center">
      <button @click="showForm = !showForm"
        class="px-6 py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition font-body min-h-[44px]">
        {{ showForm ? '取消' : '+ 新增任务' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 max-w-lg mx-auto">
      <input v-model="form.title" placeholder="任务名称"
        class="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300" />
      <div>
        <div class="text-xs text-slate-400 mb-2">任务分类</div>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="q in quadrants" :key="q.key" @click="form.quadrant = q.key"
            :class="[form.quadrant === q.key ? q.border + ' ' + q.bg : 'bg-slate-50 border border-transparent', q.text]"
            class="p-3 rounded-xl text-xs font-medium transition border-2">{{ q.label }}</button>
        </div>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <label class="flex items-center gap-2 text-sm text-slate-500 cursor-pointer min-h-[44px]">
          <input type="checkbox" v-model="form.useAI" class="rounded accent-slate-800" />
          <span>AI 智能优化</span>
        </label>
      </div>
      <button @click="addTask" :disabled="taskLoading"
        class="w-full py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 hover:scale-[1.02] transition disabled:opacity-50 font-body">
        {{ taskLoading ? '优化中...' : '确认添加' }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="q in quadrants" :key="q.key" class="p-6 rounded-3xl border-2 min-h-[200px]" :class="q.bg + ' ' + q.border">
        <h2 class="font-bold text-sm mb-4 font-heading" :class="q.text">{{ q.label }}</h2>
        <div class="space-y-3">
          <div v-for="t in getTasks(q.key)" :key="t.id"
            class="p-4 bg-white rounded-2xl shadow-sm flex items-start gap-3 border border-slate-100"
            :class="{'opacity-50 line-through':t.done}">
            <input type="checkbox" :checked="t.done" @change="toggleTask(t)" class="mt-1 shrink-0 accent-slate-800 rounded" />
            <div class="flex-1 min-w-0">
              <span class="text-slate-700 font-medium text-sm">{{ t.title }}</span>
              <div v-if="t.aiOptimized" class="text-accent-600 mt-2 text-xs leading-relaxed">{{ t.aiOptimized }}</div>
              <div v-if="t.optimizing" class="text-slate-400 mt-2 animate-pulse text-xs">优化中...</div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="optimizeTask(t)" :disabled="t.optimizing"
                class="text-indigo-400 hover:text-indigo-600 text-xs min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors hover:bg-indigo-50 rounded-xl"><Sparkles :size="14" /></button>
              <button @click="deleteTask(t.id)"
                class="text-rose-300 hover:text-rose-500 text-xs btn-delete min-w-[36px] min-h-[36px] transition">✕</button>
            </div>
          </div>
          <div v-if="getTasks(q.key).length === 0" class="text-center text-slate-300 text-sm py-8">暂无任务</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'; import { storage, KEYS } from '../services/storage'; import { askAI } from '../services/ai'; import { Plus, X, Sparkles, Trash2 } from 'lucide-vue-next';
const showForm = ref(false); const form = ref({title:'',quadrant:'q2',useAI:false}); const taskVersion = ref(0); const taskLoading = ref(false);
const tasks = computed(() => { taskVersion.value; return storage.get(KEYS.TASKS); });
const quadrants = [
  { key:'q1',label:'重要且紧急',border:'border-rose-200',bg:'bg-rose-50/30',text:'text-rose-600' },
  { key:'q2',label:'重要不紧急',border:'border-amber-200',bg:'bg-amber-50/30',text:'text-amber-600' },
  { key:'q3',label:'紧急不重要',border:'border-slate-200',bg:'bg-slate-50',text:'text-slate-600' },
  { key:'q4',label:'不重要不紧急',border:'border-slate-200',bg:'bg-slate-50/50',text:'text-slate-500' },
];
const refreshTasks = () => { taskVersion.value++; };
const getTasks = (q) => tasks.value.filter(t => t.quadrant === q);
const addTask = async () => { if(!form.value.title.trim()) return alert('请输入任务名称'); const d={...form.value,done:false}; const ai=form.value.useAI; form.value={title:'',quadrant:'q2',useAI:false}; if(ai&&d.title.trim()){ showForm.value=false; taskLoading.value=true; const tid=Date.now(); storage.add(KEYS.TASKS,{...d,optimizing:true,aiOptimized:'',id:tid}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是任务管理专家，优化用户的任务描述让它更具体更可执行。',userMessage:'任务：'+d.title}); storage.update(KEYS.TASKS,tid,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,tid,{aiOptimized:'⚠️ '+e.message,optimizing:false});} refreshTasks(); taskLoading.value=false; }else{ storage.add(KEYS.TASKS,{...d,done:false}); showForm.value=false; refreshTasks(); } };
const toggleTask = (t) => { storage.update(KEYS.TASKS,t.id,{done:!t.done}); refreshTasks(); };
const deleteTask = (id) => { if(confirm('确定删除？')){ storage.delete(KEYS.TASKS,id); refreshTasks(); } };
const optimizeTask = async (t) => { storage.update(KEYS.TASKS,t.id,{optimizing:true}); refreshTasks(); try{ const r=await askAI({systemPrompt:'你是任务管理专家，优化用户的任务描述。',userMessage:'任务：'+t.title}); storage.update(KEYS.TASKS,t.id,{aiOptimized:r,optimizing:false}); }catch(e){storage.update(KEYS.TASKS,t.id,{aiOptimized:'⚠️ '+e.message,optimizing:false});} refreshTasks(); };
</script>
