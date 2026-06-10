<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- 左侧：对话主区域 -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 class="text-xl font-black text-slate-800">💬 AI 对话</h1>
          <p class="text-xs text-slate-400 mt-1">与 AI 自由交流，选择不同的智能大脑</p>
        </div>
        <button @click="showHistory = !showHistory" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition flex items-center gap-1.5">
          <span>💬</span>
          <span class="text-slate-600">历史记录</span>
          <span v-if="conversations.length > 0" class="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ conversations.length }}</span>
        </button>
      </div>

      <div class="p-4 flex gap-2 flex-wrap bg-slate-50 border-b">
        <button v-for="prov in providers" :key="prov.key" @click="selectProvider(prov.key)"
          :class="selectedProvider === prov.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'"
          class="px-4 py-2 rounded-xl text-sm font-medium transition border">
          {{ prov.icon }} {{ prov.name }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6" ref="chatContainer">
        <div v-if="messages.length === 0" class="text-center text-slate-400 py-20">
          开始与 AI 对话吧 👋
        </div>
        <div class="space-y-4 max-w-3xl mx-auto">
          <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'ml-auto' : 'mr-auto'" class="max-w-[80%]">
            <div :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white border shadow-sm'" class="p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
              {{ msg.content }}
            </div>
            <div class="text-[10px] text-slate-400 mt-1" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
              {{ msg.time }}
            </div>
          </div>
        </div>
        <div v-if="loading" class="text-center text-slate-400 py-4">
          <span class="animate-pulse">AI 正在思考...</span>
        </div>
      </div>
      
      <div class="p-4 border-t bg-white">
        <div class="flex gap-2 max-w-3xl mx-auto">
          <textarea v-model="input" rows="2" placeholder="输入消息..." class="flex-1 p-3 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-300 resize-none" @keyup.ctrl.enter="sendMessage"></textarea>
          <button @click="sendMessage" :disabled="loading || !input.trim()" class="px-6 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 self-end">
            发送
          </button>
        </div>
        <p class="text-[10px] text-slate-400 mt-2 text-center">Ctrl + Enter 发送</p>
      </div>
    </div>

    <!-- 右侧：历史对话面板 -->
    <transition name="slide">
      <aside v-if="showHistory" class="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="font-bold text-slate-800">💬 对话历史</h2>
          <button @click="showHistory = false" class="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <button @click="startNewChat" class="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-xl text-sm text-indigo-700 font-medium transition">
            ✨ 新建对话
          </button>
          <div v-if="conversations.length === 0" class="text-center text-slate-400 text-xs py-8">暂无历史对话</div>
          <div v-for="conv in conversations" :key="conv.id" 
            @click="loadConversation(conv)"
            :class="currentConvId === conv.id ? 'bg-indigo-100 border-indigo-300' : 'bg-white hover:bg-slate-50 border-transparent'"
            class="p-3 border rounded-xl cursor-pointer transition group">
            <div class="flex justify-between items-start">
              <div class="text-sm font-medium text-slate-800 truncate flex-1">{{ conv.title }}</div>
              <button @click.stop="deleteConversation(conv.id)" class="text-slate-300 hover:text-red-400 text-xs ml-2 opacity-0 group-hover:opacity-100 transition" title="删除对话">&times;</button>
            </div>
            <div class="text-xs text-slate-400 mt-1">{{ conv.date }}</div>
          </div>
        </div>
        <div class="p-3 border-t">
          <button @click="startNewChat" class="w-full p-2.5 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-800 transition">
            + 新建对话
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { askAI } from '../services/ai';

const CONVERSATIONS_KEY = 'lb_conversations';
const CURRENT_CONV_KEY = 'lb_current_conversation';

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
const conversations = ref([]);
const currentConvId = ref(null);
const showHistory = ref(false);

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

const loadConversations = () => {
  const saved = localStorage.getItem(CONVERSATIONS_KEY);
  if (saved) {
    conversations.value = JSON.parse(saved);
  }
  
  const currentId = localStorage.getItem(CURRENT_CONV_KEY);
  if (currentId && conversations.value.find(c => c.id === currentId)) {
    loadConversation(conversations.value.find(c => c.id === currentId));
  } else if (conversations.value.length > 0) {
    loadConversation(conversations.value[0]);
  }
};

const saveConversations = () => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations.value));
};

const loadConversation = (conv) => {
  currentConvId.value = conv.id;
  messages.value = conv.messages || [];
  selectedProvider.value = conv.provider || 'zhipu';
  localStorage.setItem(CURRENT_CONV_KEY, conv.id);
  scrollToBottom();
};

const startNewChat = () => {
  const newConv = {
    id: Date.now(),
    title: '新对话',
    date: new Date().toLocaleDateString('zh-CN'),
    messages: [],
    provider: 'zhipu'
  };
  conversations.value.unshift(newConv);
  currentConvId.value = newConv.id;
  messages.value = [];
  selectedProvider.value = 'zhipu';
  localStorage.setItem(CURRENT_CONV_KEY, newConv.id);
  saveConversations();
  showHistory.value = false;
};

const deleteConversation = (id) => {
  if (!confirm('确定删除此对话？')) return;
  
  conversations.value = conversations.value.filter(c => c.id !== id);
  saveConversations();
  
  if (currentConvId.value === id) {
    if (conversations.value.length > 0) {
      loadConversation(conversations.value[0]);
    } else {
      currentConvId.value = null;
      messages.value = [];
      localStorage.removeItem(CURRENT_CONV_KEY);
    }
  }
};

const updateConversationTitle = (firstMessage) => {
  if (!currentConvId.value) return;
  
  const conv = conversations.value.find(c => c.id === currentConvId.value);
  if (conv && conv.title === '新对话') {
    conv.title = firstMessage.content.substring(0, 20) + (firstMessage.content.length > 20 ? '...' : '');
    saveConversations();
  }
};

const saveCurrentMessages = () => {
  if (!currentConvId.value) return;
  
  const conv = conversations.value.find(c => c.id === currentConvId.value);
  if (conv) {
    conv.messages = messages.value;
    conv.provider = selectedProvider.value;
    saveConversations();
  }
};

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;

  if (!currentConvId.value) {
    startNewChat();
  }

  const userMsg = {
    id: Date.now(),
    role: 'user',
    content: input.value.trim(),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };

  messages.value.push(userMsg);
  
  if (messages.value.length === 1) {
    updateConversationTitle(userMsg);
  }
  
  saveCurrentMessages();
  
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
    saveCurrentMessages();
    scrollToBottom();
  } catch (e) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: '⚠️ ' + e.message,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    saveCurrentMessages();
  }

  loading.value = false;
};

onMounted(() => {
  loadConversations();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>