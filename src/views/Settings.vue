<template>
  <div class="space-y-6">
    <div class="border-b border-slate-100 pb-4"><h1 class="text-2xl font-bold text-slate-800">AI 大脑神经中枢</h1><p class="text-xs text-slate-400 mt-1">配置国内大模型密钥，数据纯前端存储在你的个人浏览器中，绝对安全。</p></div>
    <div class="bg-indigo-50 border border-indigo-100 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <span class="text-sm font-semibold text-indigo-900">🧥 设定当前全站默认思维大脑</span>
      <select v-model="active" @change="save" class="p-2 bg-white border border-indigo-100 rounded-xl outline-none text-sm text-slate-700 w-full sm:w-auto"><option value="zhipu">智谱 GLM-4-Flash</option><option value="deepseek">DeepSeek-Chat</option><option value="qwen">阿里通义千问-Plus</option><option value="doubao">字节豆包</option><option value="yuanbao">腾讯元宝</option></select>
    </div>
    <div class="space-y-4">
      <div v-for="(name, key) in providerNames" :key="key" class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center"><span class="font-bold text-slate-700 text-sm">{{ name }} API Key</span><input v-model="keys[key]" type="password" placeholder="请输入 sk-..." class="md:col-span-2 p-2.5 bg-slate-50 rounded-2xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300" /></div>
      <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center"><span class="font-bold text-green-600 text-sm">豆包专属 Endpoint ID</span><input v-model="keys['doubao_model']" type="text" placeholder="ep-..." class="md:col-span-2 p-2.5 bg-slate-50 rounded-2xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-100" /></div>
    </div>
    <button @click="save" class="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-medium shadow-lg hover:bg-indigo-700 hover:scale-105 transition">保存全套配置</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'; import { storage } from '../services/storage';
const keys = ref({}); const active = ref('zhipu');
const providerNames = { zhipu:'智谱清言',deepseek:'DeepSeek',qwen:'通义千问',doubao:'字节豆包',yuanbao:'腾讯元宝' };
onMounted(() => { const c=storage.getAIConfig(); keys.value=c.keys; active.value=c.active; if(!keys.value.zhipu){ keys.value.zhipu='8fcff9314cc0435d9887abacad4d3d81.QwAwgrEnWTnttD4y'; storage.saveAIConfig(keys.value,active.value); } });
const save = () => { storage.saveAIConfig(keys.value,active.value); alert('✅ AI 配置已安全固化至本地！'); };
</script>