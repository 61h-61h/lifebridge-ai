<template>
  <div class="p-8 max-w-2xl mx-auto space-y-6">
    <div class="border-b pb-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-slate-800">💬 朋友圈</h1>
        <p class="text-xs text-slate-400 mt-1">分享你的生活瞬间</p>
      </div>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition">
        {{ showForm ? '取消' : '+ 发布动态' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
      <textarea v-model="form.content" rows="3" placeholder="此刻的想法..." class="w-full p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300 resize-none"></textarea>
      <div class="flex justify-between items-center">
        <div class="flex gap-1">
          <button v-for="m in quickMoods" :key="m" @click="form.mood = form.mood === m ? '' : m"
            class="text-lg px-1.5 py-0.5 rounded-lg transition"
            :class="form.mood === m ? 'bg-indigo-100' : 'hover:bg-slate-50'">
            {{ m }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.isPrivate" id="privacy" class="accent-indigo-500" />
        <label for="privacy" class="text-sm text-slate-600">🔒 设为隐私（需要密码查看）</label>
      </div>
      <div v-if="form.isPrivate">
        <input v-model="form.password" type="password" placeholder="设置查看密码" class="w-full p-2.5 border rounded-xl text-sm outline-none" />
      </div>
      <div>
        <label class="text-sm text-slate-600 block mb-2">上传图片（可选）</label>
        <input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm" />
      </div>
      <button @click="addMoment" class="px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition w-full">发布</button>
    </div>

    <div class="flex gap-2 mb-4">
      <button @click="filter = 'all'" :class="filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'" class="px-3 py-1.5 rounded-lg text-xs font-medium">全部</button>
      <button @click="filter = 'public'" :class="filter === 'public' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'" class="px-3 py-1.5 rounded-lg text-xs font-medium">公共</button>
      <button @click="filter = 'private'" :class="filter === 'private' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'" class="px-3 py-1.5 rounded-lg text-xs font-medium">🔒 隐私</button>
    </div>

    <div class="space-y-4">
      <div v-for="m in filteredMoments" :key="m.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">我</div>
            <span class="text-xs text-slate-400">{{ m.createdAt }}</span>
            <span v-if="m.mood" class="text-sm">{{ m.mood }}</span>
            <span v-if="m.isPrivate" class="text-xs">🔒</span>
          </div>
          <button @click="deleteMoment(m.id)" class="text-red-400 hover:text-red-600 text-xs">删除</button>
        </div>
        
        <div v-if="m.isPrivate && !m.unlocked" class="mt-3">
          <input v-model="m.inputPassword" type="password" placeholder="输入密码查看内容" class="w-full p-2 border rounded-lg text-sm" @keyup.enter="unlockMoment(m)" />
          <button @click="unlockMoment(m)" class="mt-2 px-4 py-1 bg-indigo-600 text-white text-xs rounded-lg">解锁</button>
        </div>
        
        <div v-else>
          <p class="mt-3 text-sm text-slate-700 leading-relaxed">{{ m.content }}</p>
          <img v-if="m.image" :src="m.image" class="mt-3 rounded-xl max-h-80 w-full object-cover" />
          <div class="mt-3 flex gap-4 text-xs text-slate-400">
            <button @click="aiComment(m)" :disabled="m.aiLoading" class="hover:text-indigo-500 transition">
              {{ m.aiLoading ? '🤖 思考中...' : '🤖 AI 评论' }}
            </button>
          </div>
          <div v-if="m.aiComment" class="mt-2 p-3 bg-purple-50 rounded-xl text-xs text-purple-700">🤖 {{ m.aiComment }}</div>
        </div>
      </div>
      <div v-if="filteredMoments.length === 0" class="text-center text-slate-400 text-sm py-8">还没有动态，说点什么吧 🎤</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storage, KEYS } from '../services/storage';
import { askAI } from '../services/ai';

const quickMoods = ['😊', '🤔', '😢', '🥳', '😤', '🥰'];
const form = ref({ content: '', mood: '', isPrivate: false, password: '', image: '' });
const filter = ref('all');

const moments = computed(() => storage.get(KEYS.MOMENTS));

const filteredMoments = computed(() => {
  if (filter.value === 'public') return moments.value.filter(m => !m.isPrivate);
  if (filter.value === 'private') return moments.value.filter(m => m.isPrivate);
  return moments.value;
});

const addMoment = () => {
  if (!form.value.content.trim()) return alert('请写点什么');
  if (form.value.isPrivate && !form.value.password.trim()) return alert('隐私动态需要设置密码');
  storage.add(KEYS.MOMENTS, { 
    ...form.value, 
    aiComment: '', 
    aiLoading: false,
    unlocked: false 
  });
  form.value = { content: '', mood: '', isPrivate: false, password: '', image: '' };
};

const deleteMoment = (id) => {
  if (confirm('确定删除此动态？')) storage.delete(KEYS.MOMENTS, id);
};

const unlockMoment = (moment) => {
  if (moment.inputPassword === moment.password) {
    moment.unlocked = true;
    storage.update(KEYS.MOMENTS, moment.id, { unlocked: true });
  } else {
    alert('密码错误');
  }
};

const aiComment = async (moment) => {
  storage.update(KEYS.MOMENTS, moment.id, { aiLoading: true });
  try {
    const res = await askAI({
      systemPrompt: '你是一个风趣幽默的朋友，用轻松的语气回应对方的动态，就像朋友圈评论一样。',
      userMessage: moment.content
    });
    storage.update(KEYS.MOMENTS, moment.id, { aiComment: res, aiLoading: false });
  } catch (e) {
    storage.update(KEYS.MOMENTS, moment.id, { aiComment: '⚠️ ' + e.message, aiLoading: false });
  }
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
</script>
