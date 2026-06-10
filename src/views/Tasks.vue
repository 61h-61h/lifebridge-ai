<template>
  <div class="p-4 md:p-8 space-y-4 md:space-y-6">
    <div class="border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-slate-800">✅ 四象限任务板</h1>
        <p class="text-xs text-slate-400 mt-1">按照重要与紧急程度管理任务</p>
      </div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition" :class="showForm ? 'btn-cancel' : 'btn-add'">
        {{ showForm ? '取消' : '+ 新增任务' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
      <input v-model="form.title" placeholder="任务名称" class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300" />
      <select v-model="form.quadrant" class="w-full p-3 border rounded-xl text-sm outline-none">
        <option value="q1">🔴 重要且紧急</option>
        <option value="q2">🟡 重要不紧急</option>
        <option value="q3">🟢 紧急不重要</option>
        <option value="q4">🔵 不重要不紧急</option>
      </select>
      <button @click="addTask" class="px-6 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-800 transition">确认添加</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="q in quadrants" :key="q.key" class="p-3 md:p-4 rounded-2xl border-2 min-h-[150px] md:min-h-[200px]" :class="q.borderClass">
        <h2 class="font-bold text-sm mb-3" :class="q.textClass">{{ q.label }}</h2>
        <div class="space-y-2">
          <div v-for="t in getTasks(q.key)" :key="t.id"
            class="p-2.5 md:p-3 bg-white rounded-xl text-xs shadow-sm flex items-start gap-2"
            :class="{ 'opacity-50 line-through': t.done }">
            <input type="checkbox" :checked="t.done" @change="toggleTask(t)" class="mt-0.5" />
            <div class="flex-1">
              <span class="text-slate-700 font-medium">{{ t.title }}</span>
              <div v-if="t.aiOptimized" class="text-indigo-600 mt-1">✨ {{ t.aiOptimized }}</div>
            </div>
            <div class="flex flex-col gap-1">
              <button @click="optimizeTask(t)" :disabled="t.optimizing" class="text-indigo-400 hover:text-indigo-600 text-[10px]">
                {{ t.optimizing ? '...' : 'AI优化' }}
              </button>
              <button @click="deleteTask(t.id)" class="text-red-400 hover:text-red-600 text-[10px]">✕</button>
            </div>
          </div>
          <div v-if="getTasks(q.key).length === 0" class="text-center text-slate-300 text-xs py-4">暂无任务</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage, KEYS } from '../services/storage';
import { askAI } from '../services/ai';

const showForm = ref(false);
const form = ref({ title: '', quadrant: 'q2' });
const taskVersion = ref(0);
const tasks = computed(() => {
  taskVersion.value;
  return storage.get(KEYS.TASKS);
});

const quadrants = [
  { key: 'q1', label: '🔴 重要且紧急', borderClass: 'border-red-200 bg-red-50/50', textClass: 'text-red-700' },
  { key: 'q2', label: '🟡 重要不紧急', borderClass: 'border-yellow-200 bg-yellow-50/50', textClass: 'text-yellow-700' },
  { key: 'q3', label: '🟢 紧急不重要', borderClass: 'border-green-200 bg-green-50/50', textClass: 'text-green-700' },
  { key: 'q4', label: '🔵 不重要不紧急', borderClass: 'border-blue-200 bg-blue-50/50', textClass: 'text-blue-700' },
];

const refreshTasks = () => {
  taskVersion.value++;
};

const getTasks = (quadrant) => {
  return tasks.value.filter(t => t.quadrant === quadrant);
};

const addTask = () => {
  if (!form.value.title.trim()) return alert('请输入任务名称');
  storage.add(KEYS.TASKS, { ...form.value, done: false });
  form.value = { title: '', quadrant: 'q2' };
  showForm.value = false;
  refreshTasks();
};

const toggleTask = (task) => {
  storage.update(KEYS.TASKS, task.id, { done: !task.done });
  refreshTasks();
};

const deleteTask = (id) => {
  if (confirm('确定删除此任务？')) {
    storage.delete(KEYS.TASKS, id);
    refreshTasks();
  }
};

const optimizeTask = async (task) => {
  storage.update(KEYS.TASKS, task.id, { optimizing: true });
  refreshTasks();
  try {
    const res = await askAI({
      systemPrompt: '你是一个任务管理专家，请优化用户的任务描述，让它更具体、更可执行。返回简洁的优化建议。',
      userMessage: `任务：${task.title}`
    });
    storage.update(KEYS.TASKS, task.id, { aiOptimized: res, optimizing: false });
  } catch (e) {
    storage.update(KEYS.TASKS, task.id, { aiOptimized: '⚠️ ' + e.message, optimizing: false });
  }
  refreshTasks();
};
</script>
