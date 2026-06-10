<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <div class="border-b pb-4">
      <h1 class="text-2xl font-black text-slate-800">💬 AI 对话</h1>
      <p class="text-xs text-slate-400 mt-1">与 AI 自由交流，选择不同的智能大脑</p>
    </div>

    <div class="flex gap-2 flex-wrap">
      <button v-for="prov in providers" :key="prov.key" @click="selectProvider(prov.key)"
        :class="selectedProvider === prov.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition">
        {{ prov.icon }} {{ prov.name }}
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
      <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
        <div v-if="messages.length === 0" class="text-center text-slate-400 text-sm py-8">
          开始与 AI 对话吧 👋
        </div>
        <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'ml-auto' : 'mr-auto'" class="max-w-[80%]">
          <div :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800'" class="p-3 rounded-xl text-sm leading-relaxed">
            {{ msg.content }}
          </div>
          <div class="text-[10px] text-slate-400 mt-1" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
            {{ msg.time }}
          </div>
        </div>
        <div v-if="loading" class="flex items-center gap-2 text-slate-400 text-sm">
          <span class="animate-pulse">AI 正在思考...</span>
        </div>
      </div>
      
      <div class="border-t p-4">
        <div class="flex gap-2">
          <textarea v-model="input" rows="2" placeholder="输入消息..." class="flex-1 p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300 resize-none" @keyup.ctrl.enter="sendMessage"></textarea>
          <button @click="sendMessage" :disabled="loading || !input.trim()" class="px-6 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
            发送
          </button>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">Ctrl + Enter 发送</p>
      </div>
    </div>

    <button @click="clearChat" class="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-300 transition">
      清空对话
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { askAI } from '../services/ai';

const providers = [
  { key: 'zhipu', name: '智谱清言', icon: '🧠' },
  { key: 'deepseek', name: 'DeepSeek', icon: '🤖' },
  { key: 'qwen', name: '通义千问', icon: '💬' },
  { key: 'doubao', name: '豆包', icon: '🫘' },
  { key: 'yuanbao', name: '腾讯元宝', icon: '🐧' }
];

const selectedProvider = ref('zhipu');
const input = ref('');
const messages = ref([]);
const loading = ref(false);
const chatContainer = ref(null);

const selectProvider = (key) => {
  selectedProvider.value = key;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;

  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: input.value.trim(),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };

  messages.value.push(userMsg);
  const userInput = input.value.trim();
  input.value = '';
  loading.value = true;
  scrollToBottom();

  try {
    const response = await askAI({
      systemPrompt: '你是一个友好、专业的 AI 助手，用自然、流畅的语言回答用户的问题。',
      userMessage: userInput,
      provider: selectedProvider.value
    });

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    messages.value.push(aiMsg);
    scrollToBottom();
  } catch (e) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: '⚠️ ' + e.message,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
  }

  loading.value = false;
};

const clearChat = () => {
  if (confirm('确定清空所有对话？')) {
    messages.value = [];
  }
};
</script>
