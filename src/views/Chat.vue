<template>
  <div class="flex h-full bg-lacquer overflow-hidden">
    <div class="flex-1 flex flex-col min-w-0">
      <div class="p-3 md:p-6 border-b border-hairline bg-lacquer-deep flex justify-between items-center">
        <div><h1 class="text-lg md:text-xl text-champagne font-display font-semibold">💬 AI 对话</h1><p class="hidden md:block text-xs text-text-faint mt-1 font-mono">与 AI 自由交流，选择不同的智能大脑</p></div>
        <button @click="showHistory = !showHistory" class="px-3 py-2 bg-graphite hover:bg-graphite-2 rounded-xl text-sm transition flex items-center gap-1.5 text-text-warm border border-hairline"><span>💬</span><span class="text-text-muted">历史记录</span><span v-if="conversations.length > 0" class="bg-kinpaku/30 text-kinpaku text-[10px] px-1.5 py-0.5 rounded-full">{{ conversations.length }}</span></button>
      </div>
      <div class="p-2 md:p-4 flex gap-1.5 md:gap-2 flex-wrap bg-lacquer border-b border-hairline">
        <button v-for="prov in providers" :key="prov.key" @click="selectProvider(prov.key)" :class="selectedProvider === prov.key ? 'bg-kinpaku/20 text-kinpaku border-hairline-strong' : 'bg-lacquer-raised text-text-muted hover:text-champagne border-hairline'" class="px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm transition border">{{ prov.icon }} {{ prov.name }}</button>
      </div>
      <div class="flex-1 overflow-y-auto p-3 md:p-6" ref="chatContainer">
        <div v-if="messages.length === 0" class="text-center text-text-faint py-20">开始与 AI 对话吧 👋</div>
        <div class="space-y-4 max-w-3xl mx-auto">
          <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'ml-auto' : 'mr-auto'" class="max-w-[90%] md:max-w-[80%]">
            <div :class="msg.role === 'user' ? 'bg-kinpaku/15 text-kinpaku-pale border-hairline-strong' : 'card'" class="p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border">{{ msg.content }}</div>
            <div class="text-[10px] text-text-faint mt-1 font-mono" :class="msg.role === 'user' ? 'text-right' : 'text-left'">{{ msg.time }}</div>
          </div>
        </div>
        <div v-if="loading" class="text-center text-text-faint py-4"><span class="animate-pulse">AI 正在思考...</span></div>
      </div>
      <div class="p-3 md:p-4 border-t border-hairline bg-lacquer-deep">
        <div class="flex gap-2 max-w-3xl mx-auto">
          <textarea v-model="input" rows="2" placeholder="输入消息..." class="flex-1 p-3 bg-lacquer border border-hairline rounded-xl text-sm text-text-warm outline-none focus:border-hairline-strong resize-none placeholder:text-text-faint" @keyup.ctrl.enter="sendMessage"></textarea>
          <button @click="sendMessage" :disabled="loading || !input.trim()" class="px-6 py-3 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition disabled:opacity-50 self-end border border-hairline-strong">发送</button>
        </div>
        <p class="text-[10px] text-text-faint mt-2 text-center font-mono">Ctrl + Enter 发送</p>
      </div>
    </div>
    <transition name="slide">
      <aside v-if="showHistory" class="w-full md:w-72 bg-lacquer-deep border-l border-hairline flex flex-col shrink-0 absolute md:static inset-0 z-10">
        <div class="p-4 border-b border-hairline flex justify-between items-center"><h2 class="text-champagne font-semibold">💬 对话历史</h2><button @click="showHistory = false" class="text-text-faint hover:text-text-warm text-xl leading-none">&times;</button></div>
        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <button @click="startNewChat" class="w-full p-3 text-left bg-kinpaku/10 hover:bg-kinpaku/20 rounded-xl text-sm text-kinpaku transition border border-hairline-strong">✨ 新建对话</button>
          <div v-if="conversations.length === 0" class="text-center text-text-faint text-xs py-8">暂无历史对话</div>
          <div v-for="conv in conversations" :key="conv.id" @click="loadConversation(conv)" :class="currentConvId === conv.id ? 'bg-kinpaku/10 border-hairline-strong' : 'bg-lacquer-raised hover:bg-graphite border-hairline'" class="p-3 border rounded-xl cursor-pointer transition group"><div class="flex justify-between items-start"><div class="text-sm text-text-warm truncate flex-1">{{ conv.title }}</div><button @click.stop="deleteConversation(conv.id)" class="text-text-faint hover:text-vermilion text-xs ml-2 opacity-0 group-hover:opacity-100 transition" title="删除对话">&times;</button></div><div class="text-xs text-text-faint mt-1 font-mono">{{ conv.date }}</div></div>
        </div>
        <div class="p-3 border-t border-hairline"><button @click="startNewChat" class="w-full p-2.5 bg-kinpaku/20 text-kinpaku text-sm rounded-xl hover:bg-kinpaku/30 transition border border-hairline-strong">+ 新建对话</button></div>
      </aside>
    </transition>
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted } from 'vue'; import { askAI } from '../services/ai';
const CONVERSATIONS_KEY = 'lb_conversations'; const CURRENT_CONV_KEY = 'lb_current_conversation';
const providers = [{ key:'zhipu',name:'智谱清言',icon:'🧠' },{ key:'deepseek',name:'DeepSeek',icon:'🤖' },{ key:'qwen',name:'通义千问',icon:'💬' },{ key:'doubao',name:'豆包',icon:'🫘' },{ key:'yuanbao',name:'腾讯元宝',icon:'🐧' }];
const selectedProvider = ref('zhipu'); const input = ref(''); const messages = ref([]); const loading = ref(false); const chatContainer = ref(null); const conversations = ref([]); const currentConvId = ref(null); const showHistory = ref(false);
const selectProvider = (k) => { selectedProvider.value = k; };
const scrollToBottom = () => { nextTick(() => { if(chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }); };
const loadConversations = () => { const s=localStorage.getItem(CONVERSATIONS_KEY); if(s) conversations.value=JSON.parse(s); const cid=localStorage.getItem(CURRENT_CONV_KEY); if(cid&&conversations.value.find(c=>c.id===cid)) loadConversation(conversations.value.find(c=>c.id===cid)); else if(conversations.value.length>0) loadConversation(conversations.value[0]); };
const saveConversations = () => { localStorage.setItem(CONVERSATIONS_KEY,JSON.stringify(conversations.value)); };
const loadConversation = (conv) => { currentConvId.value=conv.id; messages.value=conv.messages?[...conv.messages]:[]; selectedProvider.value=conv.provider||'zhipu'; localStorage.setItem(CURRENT_CONV_KEY,conv.id); showHistory.value=false; nextTick(()=>scrollToBottom()); };
const startNewChat = () => { const nc={id:Date.now(),title:'新对话',date:new Date().toLocaleDateString('zh-CN'),messages:[],provider:'zhipu'}; conversations.value.unshift(nc); currentConvId.value=nc.id; messages.value=[]; selectedProvider.value='zhipu'; localStorage.setItem(CURRENT_CONV_KEY,nc.id); saveConversations(); showHistory.value=false; };
const deleteConversation = (id) => { if(!confirm('确定删除？')) return; conversations.value=conversations.value.filter(c=>c.id!==id); saveConversations(); if(currentConvId.value===id){ if(conversations.value.length>0) loadConversation(conversations.value[0]); else{ currentConvId.value=null; messages.value=[]; localStorage.removeItem(CURRENT_CONV_KEY); } } };
const updateConversationTitle = (fm) => { if(!currentConvId.value) return; const c=conversations.value.find(c=>c.id===currentConvId.value); if(c&&c.title==='新对话'){ c.title=fm.content.substring(0,20)+(fm.content.length>20?'...':''); saveConversations(); } };
const saveCurrentMessages = () => { if(!currentConvId.value) return; const c=conversations.value.find(c=>c.id===currentConvId.value); if(c){ c.messages=messages.value; c.provider=selectedProvider.value; saveConversations(); } };
const sendMessage = async () => { if(!input.value.trim()||loading.value) return; if(!currentConvId.value) startNewChat(); const um={id:Date.now(),role:'user',content:input.value.trim(),time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}; messages.value.push(um); if(messages.value.length===1) updateConversationTitle(um); saveCurrentMessages(); const ui=input.value.trim(); input.value=''; loading.value=true; scrollToBottom(); try{ const r=await askAI({systemPrompt:'你是一个友好、专业的 AI 助手，用自然、流畅的语言回答用户的问题。',userMessage:ui,provider:selectedProvider.value}); messages.value.push({id:Date.now()+1,role:'assistant',content:r,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}); saveCurrentMessages(); scrollToBottom(); }catch(e){ messages.value.push({id:Date.now()+1,role:'assistant',content:'⚠️ '+e.message,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}); saveCurrentMessages(); } loading.value=false; };
onMounted(() => { loadConversations(); });
</script>
<style scoped>
.slide-enter-active,.slide-leave-active{ transition:all 0.25s ease; }
.slide-enter-from,.slide-leave-to{ transform:translateX(100%); opacity:0; }
</style>