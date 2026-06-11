<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Header -->
    <div class="border-b border-slate-100 pb-3 flex justify-between items-center shrink-0">
      <div><h1 class="text-xl md:text-2xl font-bold text-slate-800">💻 AI 对话</h1><p class="hidden md:block text-xs text-slate-400 mt-1">与 AI 自由交流，选择不同的智能大脑</p></div>
      <div class="relative">
        <button @click="showHistory = !showHistory" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition flex items-center gap-1.5 text-slate-600">
          <span>📜</span><span>历史记录</span>
          <span v-if="conversations.length > 0" class="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ conversations.length }}</span>
        </button>
        <transition name="dropdown">
          <div v-if="showHistory" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-lg border border-slate-100 z-30 flex flex-col max-h-[70vh]">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 class="font-bold text-slate-800 text-sm">📜 对话历史</h2>
              <button @click="showHistory = false" class="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-1.5">
              <button @click="startNewChat" class="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-2xl text-sm text-indigo-600 font-medium transition">✏️ 新建对话</button>
              <div v-if="conversations.length === 0" class="text-center text-slate-400 text-xs py-6">暂无历史对话</div>
              <div v-for="conv in conversations" :key="conv.id" @click="loadConversation(conv)"
                :class="currentConvId === conv.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:bg-slate-50 border-transparent'"
                class="p-3 border rounded-2xl cursor-pointer transition group">
                <div class="flex justify-between items-start">
                  <div class="text-sm text-slate-700 truncate flex-1">{{ conv.title }}</div>
                  <button @click.stop="deleteConversation(conv.id)" class="text-slate-300 hover:text-rose-400 text-xs ml-2 opacity-0 group-hover:opacity-100 transition shrink-0">&times;</button>
                </div>
                <div class="text-xs text-slate-400 mt-1 handwritten">{{ conv.date }}</div>
              </div>
            </div>
          </div>
        </transition>
        <div v-if="showHistory" class="fixed inset-0 z-20 md:hidden" @click="showHistory = false"></div>
      </div>
    </div>

    <!-- Provider buttons -->
    <div class="py-2 flex gap-1.5 md:gap-2 flex-wrap shrink-0">
      <button v-for="prov in providers" :key="prov.key" @click="selectProvider(prov.key)"
        :class="selectedProvider === prov.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'"
        class="px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm transition hover:scale-105">
        {{ prov.icon }} {{ prov.name }}
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto py-3" ref="chatContainer">
      <div v-if="messages.length === 0" class="text-center text-slate-400 py-20">开始与 AI 对话吧 💬</div>
      <div class="space-y-4 max-w-3xl mx-auto">
        <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'ml-auto' : 'mr-auto'" class="max-w-[90%] md:max-w-[80%]">
          <div :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white border border-slate-100 shadow-sm'" class="p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</div>
          <div class="text-[10px] text-slate-400 mt-1 handwritten" :class="msg.role === 'user' ? 'text-right' : 'text-left'">{{ msg.time }}</div>
        </div>
      </div>
      <div v-if="loading" class="text-center text-slate-400 py-4"><span class="animate-pulse">AI 正在思考...</span></div>
    </div>

    <!-- Input -->
    <div class="py-3 border-t border-slate-100 bg-white shrink-0">
      <div class="flex gap-2 max-w-3xl mx-auto">
        <textarea v-model="input" rows="2" placeholder="输入消息..." class="flex-1 p-3 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 resize-none placeholder:text-slate-300" @keyup.ctrl.enter="sendMessage"></textarea>
        <button @click="sendMessage" :disabled="loading || !input.trim()" class="px-6 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 hover:scale-105 transition disabled:opacity-50 self-end">发送</button>
      </div>
      <p class="text-[10px] text-slate-400 mt-2 text-center">Ctrl + Enter 发送</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'; import { askAI } from '../services/ai';
const CONVERSATIONS_KEY = 'lb_conversations'; const CURRENT_CONV_KEY = 'lb_current_conversation';
const providers = [{key:'zhipu',name:'智谱清言',icon:'🧥'},{key:'deepseek',name:'DeepSeek',icon:'💻'},{key:'qwen',name:'通义千问',icon:'👰'},{key:'doubao',name:'豆包',icon:'🫀'},{key:'yuanbao',name:'腾讯元宝',icon:'💂'}];
const selectedProvider = ref('zhipu'); const input = ref(''); const messages = ref([]); const loading = ref(false); const chatContainer = ref(null); const conversations = ref([]); const currentConvId = ref(null); const showHistory = ref(false);
const selectProvider = (k) => { selectedProvider.value = k; };
const scrollToBottom = () => { nextTick(() => { if(chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }); };
const loadConversations = () => { const s=localStorage.getItem(CONVERSATIONS_KEY); if(s) conversations.value=JSON.parse(s); const cid=localStorage.getItem(CURRENT_CONV_KEY); if(cid&&conversations.value.find(c=>c.id===cid)) loadConversation(conversations.value.find(c=>c.id===cid)); else if(conversations.value.length>0) loadConversation(conversations.value[0]); };
const saveConversations = () => { localStorage.setItem(CONVERSATIONS_KEY,JSON.stringify(conversations.value)); };
const loadConversation = (conv) => { currentConvId.value=conv.id; messages.value=conv.messages?[...conv.messages]:[]; selectedProvider.value=conv.provider||'zhipu'; localStorage.setItem(CURRENT_CONV_KEY,conv.id); showHistory.value=false; nextTick(()=>scrollToBottom()); };
const startNewChat = () => { const nc={id:Date.now(),title:'新对话',date:new Date().toLocaleDateString('zh-CN'),messages:[],provider:'zhipu'}; conversations.value.unshift(nc); currentConvId.value=nc.id; messages.value=[]; selectedProvider.value='zhipu'; localStorage.setItem(CURRENT_CONV_KEY,nc.id); saveConversations(); showHistory.value=false; };
const deleteConversation = (id) => { if(!confirm('确定删除？')) return; conversations.value=conversations.value.filter(c=>c.id!==id); saveConversations(); if(currentConvId.value===id){ if(conversations.value.length>0) loadConversation(conversations.value[0]); else{currentConvId.value=null;messages.value=[];localStorage.removeItem(CURRENT_CONV_KEY);} } };
const updateConversationTitle = (fm) => { if(!currentConvId.value) return; const c=conversations.value.find(c=>c.id===currentConvId.value); if(c&&c.title==='新对话'){c.title=fm.content.substring(0,20)+(fm.content.length>20?'...':'');saveConversations();} };
const saveCurrentMessages = () => { if(!currentConvId.value) return; const c=conversations.value.find(c=>c.id===currentConvId.value); if(c){c.messages=messages.value;c.provider=selectedProvider.value;saveConversations();} };
const sendMessage = async () => { if(!input.value.trim()||loading.value) return; if(!currentConvId.value) startNewChat(); const um={id:Date.now(),role:'user',content:input.value.trim(),time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}; messages.value.push(um); if(messages.value.length===1) updateConversationTitle(um); saveCurrentMessages(); const ui=input.value.trim(); input.value=''; loading.value=true; scrollToBottom(); try{const r=await askAI({systemPrompt:'你是一个友好、专业的 AI 助手，用自然、流畅的语言回答用户的问题。',userMessage:ui,provider:selectedProvider.value}); messages.value.push({id:Date.now()+1,role:'assistant',content:r,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}); saveCurrentMessages(); scrollToBottom();}catch(e){messages.value.push({id:Date.now()+1,role:'assistant',content:'⚠️ '+e.message,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}); saveCurrentMessages();} loading.value=false; };
onMounted(() => { loadConversations(); });
</script>

<style scoped>
.dropdown-enter-active { transition: all 0.2s ease; }
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.96); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>