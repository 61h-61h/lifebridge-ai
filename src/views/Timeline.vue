<template>
  <div class="p-8 max-w-3xl mx-auto space-y-6">
    <div class="border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-slate-800">⏳ 时光纪念馆</h1>
        <p class="text-xs text-slate-400 mt-1">记录人生中每一个闪光的里程碑</p>
      </div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition">
        {{ showForm ? '取消' : '+ 新增里程碑' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
      <input v-model="form.title" placeholder="里程碑标题" class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300" />
      <input v-model="form.date" type="date" class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300" />
      <textarea v-model="form.description" rows="3" placeholder="描述这个里程碑..." class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300 resize-none"></textarea>
      <select v-model="form.category" class="w-full p-3 border rounded-xl text-sm outline-none">
        <option value="career">💼 职业</option>
        <option value="study">📚 学业</option>
        <option value="life">🏠 生活</option>
        <option value="relationship">❤️ 情感</option>
        <option value="health">💪 健康</option>
      </select>
      <div>
        <label class="text-sm text-slate-600 block mb-2">上传图片（可选）</label>
        <input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm" />
      </div>
      <button @click="addMilestone" class="px-6 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-800 transition">确认添加</button>
    </div>

    <div class="space-y-2 mb-6">
      <div v-for="reminder in activeReminders" :key="reminder.id" class="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl flex items-center gap-3">
        <span class="text-2xl">🎉</span>
        <div>
          <div class="font-bold text-amber-800 text-sm">{{ reminder.title }}</div>
          <div class="text-xs text-amber-600">{{ reminder.message }}</div>
        </div>
      </div>
    </div>

    <div class="relative pl-8 border-l-2 border-indigo-200 space-y-6">
      <div v-for="m in milestones" :key="m.id" class="relative">
        <div class="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-indigo-400 bg-white"></div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-semibold text-indigo-600">{{ categoryIcon(m.category) }} {{ formatDate(m.date) }}</span>
              <h3 class="font-bold text-slate-800 mt-1">{{ m.title }}</h3>
            </div>
            <button @click="deleteMilestone(m.id)" class="text-red-400 hover:text-red-600 text-xs">删除</button>
          </div>
          <p class="text-xs text-slate-500 mt-1">{{ getDaysMessage(m.date) }}</p>
          <p v-if="m.description" class="text-sm text-slate-500 mt-2">{{ m.description }}</p>
          <img v-if="m.image" :src="m.image" class="mt-3 rounded-xl max-h-60 w-full object-cover" />
        </div>
      </div>
      <div v-if="milestones.length === 0" class="text-center text-slate-400 text-sm py-8">还没有里程碑，记录你的第一个闪光时刻 ✨</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storage, KEYS } from '../services/storage';

const showForm = ref(false);
const form = ref({ title: '', date: '', description: '', category: 'life', image: '' });
const activeReminders = ref([]);
const notifiedMilestones = ref(new Set());

const milestones = computed(() => storage.get(KEYS.MILESTONES));

const categoryIcon = (cat) => {
  const map = { career: '💼', study: '📚', life: '🏠', relationship: '❤️', health: '💪' };
  return map[cat] || '🏠';
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const getDaysMessage = (dateStr) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
  
  if (diff > 0) {
    return `距离还有 ${diff} 天`;
  } else if (diff < 0) {
    const absDays = Math.abs(diff);
    let message = `已过去 ${absDays} 天`;
    if (absDays >= 365) message += ` (${Math.floor(absDays / 365)} 年)`;
    return message;
  } else {
    return '就是今天！🎉';
  }
};

const checkMilestones = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const reminders = [];
  
  milestones.value.forEach(m => {
    const target = new Date(m.date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.floor((now - target) / (1000 * 60 * 60 * 24));
    
    if (diff >= 0) {
      const key = `${m.id}-${diff}`;
      if (!notifiedMilestones.value.has(key)) {
        if (diff === 0) {
          reminders.push({ id: m.id, title: m.title, message: '就是今天！🎉' });
          notifiedMilestones.value.add(key);
        } else if (diff === 100) {
          reminders.push({ id: m.id, title: m.title, message: '已过去 100 天！💯' });
          notifiedMilestones.value.add(key);
        } else if (diff === 1000) {
          reminders.push({ id: m.id, title: m.title, message: '已过去 1000 天！🏆' });
          notifiedMilestones.value.add(key);
        } else if (diff === 365) {
          reminders.push({ id: m.id, title: m.title, message: '已过去整整一年！🎂' });
          notifiedMilestones.value.add(key);
        } else if (diff > 365 && diff % 365 === 0) {
          reminders.push({ id: m.id, title: m.title, message: `已过去 ${Math.floor(diff / 365)} 年！🎉` });
          notifiedMilestones.value.add(key);
        }
      }
    }
  });
  
  activeReminders.value = reminders;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addMilestone = () => {
  if (!form.value.title.trim() || !form.value.date) return alert('请填写标题和日期');
  storage.add(KEYS.MILESTONES, { ...form.value });
  form.value = { title: '', date: '', description: '', category: 'life', image: '' };
  showForm.value = false;
  checkMilestones();
};

const deleteMilestone = (id) => {
  if (confirm('确定删除此里程碑？')) {
    storage.delete(KEYS.MILESTONES, id);
    checkMilestones();
  }
};

onMounted(() => {
  checkMilestones();
});
</script>
