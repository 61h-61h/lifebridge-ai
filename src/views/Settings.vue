<template>
  <div class="max-w-2xl mx-auto space-y-10">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-800 font-heading">AI 脑核中心</h1>
      <p class="text-sm text-slate-400 mt-2">配置大模型密钥，数据纯前端存储，绝对安全</p>
    </div>

    <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <span class="text-sm font-semibold text-slate-700 font-heading">当前默认思维大脑</span>
      <select v-model="active" @change="save"
        class="p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-700 w-full sm:w-auto">
        <option value="zhipu">智谱 GLM-4-Flash</option>
        <option value="deepseek">DeepSeek-Chat</option>
        <option value="qwen">阿里通义千问-Plus</option>
        <option value="doubao">字节豆包</option>
        <option value="yuanbao">腾讯元宝</option>
      </select>
    </div>

    <div class="space-y-5">
      <div v-for="(name, key) in providerNames" :key="key"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <label class="font-bold text-slate-700 text-sm font-heading block">{{ name }} API Key</label>
        <input v-model="keys[key]" type="password" placeholder="请输入 sk-..."
          class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300" />
      </div>
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <label class="font-bold text-accent-600 text-sm font-heading block">豆包 Endpoint ID</label>
        <input v-model="keys['doubao_model']" type="text" placeholder="ep-..."
          class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-300" />
      </div>
    </div>

    <button @click="save"
      class="w-full py-4 bg-slate-800 text-white rounded-2xl text-sm font-medium shadow-lg hover:bg-slate-700 hover:scale-[1.02] transition font-body">
      保存全套配置
    </button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'; import { storage } from '../services/storage';
const keys = ref({}); const active = ref('zhipu');
const providerNames = { zhipu:'智谱清言',deepseek:'DeepSeek',qwen:'通义千问',doubao:'字节豆包',yuanbao:'腾讯元宝' };
onMounted(() => { const c=storage.getAIConfig(); keys.value=c.keys; active.value=c.active; if(!keys.value.zhipu){ keys.value.zhipu='8fcff9314cc0435d9887abacad4d3d81.QwAwgrEnWTnttD4y'; storage.saveAIConfig(keys.value,active.value); } });
const save = () => { storage.saveAIConfig(keys.value,active.value); alert('AI 配置已安全固化至本地！'); };
</script>
